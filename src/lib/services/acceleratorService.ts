"use server";

import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

interface AcceleratorProgramData {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  applicationUrl?: string;
  location?: string;
  remote: boolean;
  equity?: number;
  funding?: number;
  managerId: string;
}

interface GrantData {
  name: string;
  description: string;
  amount: number;
  deadline: Date;
  eligibility: string;
  applicationUrl?: string;
  creatorId: string;
}

interface ApplicationData {
  programId: string;
  projectId: string;
}

export async function createAcceleratorProgram(data: AcceleratorProgramData) {
  try {
    // Verify the user is an accelerator or admin
    const user = await prisma.user.findUnique({
      where: { id: data.managerId },
      select: { role: true },
    });

    if (!user || (user.role !== UserRole.ACCELERATOR && user.role !== UserRole.ADMIN)) {
      return {
        success: false,
        error: "Only accelerators or admins can create programs",
      };
    }

    const program = await prisma.acceleratorProgram.create({
      data: {
        name: data.name,
        description: data.description,
        startDate: data.startDate,
        endDate: data.endDate,
        applicationUrl: data.applicationUrl,
        location: data.location,
        remote: data.remote,
        equity: data.equity,
        funding: data.funding,
        managerId: data.managerId,
      },
    });

    return { success: true, program };
  } catch (error) {
    console.error("Error creating accelerator program:", error);
    return { success: false, error: "Failed to create accelerator program" };
  }
}

export async function getAcceleratorPrograms(limit: number = 10, offset: number = 0) {
  try {
    const programs = await prisma.acceleratorProgram.findMany({
      include: {
        manager: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.acceleratorProgram.count();

    return { success: true, programs, total };
  } catch (error) {
    console.error("Error fetching accelerator programs:", error);
    return { success: false, error: "Failed to fetch accelerator programs" };
  }
}

export async function getAcceleratorProgramsByManager(managerId: string) {
  try {
    const programs = await prisma.acceleratorProgram.findMany({
      where: {
        managerId,
      },
      include: {
        applications: {
          include: {
            project: {
              select: {
                title: true,
                industry: true,
                founderUserId: true,
                founder: {
                  select: {
                    name: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    return { success: true, programs };
  } catch (error) {
    console.error("Error fetching accelerator programs by manager:", error);
    return { success: false, error: "Failed to fetch accelerator programs" };
  }
}

export async function getAcceleratorProgramById(programId: string) {
  try {
    const program = await prisma.acceleratorProgram.findUnique({
      where: {
        id: programId,
      },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            bio: true,
            website: true,
          },
        },
        applications: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                description: true,
                industry: true,
                fundingStage: true,
                founderUserId: true,
                founder: {
                  select: {
                    name: true,
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!program) {
      return { success: false, error: "Accelerator program not found" };
    }

    return { success: true, program };
  } catch (error) {
    console.error("Error fetching accelerator program:", error);
    return { success: false, error: "Failed to fetch accelerator program" };
  }
}

export async function applyToAcceleratorProgram(data: ApplicationData) {
  try {
    // Check if program exists
    const program = await prisma.acceleratorProgram.findUnique({
      where: { id: data.programId },
    });

    if (!program) {
      return { success: false, error: "Accelerator program not found" };
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
      include: {
        founder: true,
      },
    });

    if (!project) {
      return { success: false, error: "Project not found" };
    }

    // Check if already applied
    const existingApplication = await prisma.acceleratorApplication.findFirst({
      where: {
        programId: data.programId,
        projectId: data.projectId,
      },
    });

    if (existingApplication) {
      return {
        success: false,
        error: "Already applied to this accelerator program",
      };
    }

    // Create the application
    const application = await prisma.acceleratorApplication.create({
      data: {
        programId: data.programId,
        projectId: data.projectId,
        status: "pending",
      },
    });

    // Notify the accelerator manager
    await prisma.notification.create({
      data: {
        userId: program.managerId,
        type: "accelerator_application",
        content: `New application for ${program.name} from ${project.title}`,
        relatedId: application.id,
      },
    });

    return { success: true, application };
  } catch (error) {
    console.error("Error applying to accelerator program:", error);
    return { success: false, error: "Failed to apply to accelerator program" };
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: string
) {
  try {
    const application = await prisma.acceleratorApplication.update({
      where: { id: applicationId },
      data: {
        status,
      },
      include: {
        program: true,
        project: {
          include: {
            founder: true,
          },
        },
      },
    });

    // Notify the founder
    await prisma.notification.create({
      data: {
        userId: application.project.founderUserId,
        type: "accelerator_application_update",
        content: `Your application to ${application.program.name} has been ${status}`,
        relatedId: applicationId,
      },
    });

    return { success: true, application };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, error: "Failed to update application status" };
  }
}

export async function createGrant(data: GrantData) {
  try {
    // Verify the user is a grant provider or admin
    const user = await prisma.user.findUnique({
      where: { id: data.creatorId },
      select: { role: true },
    });

    if (!user || (user.role !== UserRole.GRANT_PROVIDER && user.role !== UserRole.ADMIN)) {
      return {
        success: false,
        error: "Only grant providers or admins can create grants",
      };
    }

    const grant = await prisma.grant.create({
      data: {
        name: data.name,
        description: data.description,
        amount: data.amount,
        deadline: data.deadline,
        eligibility: data.eligibility,
        applicationUrl: data.applicationUrl,
        creatorId: data.creatorId,
      },
    });

    return { success: true, grant };
  } catch (error) {
    console.error("Error creating grant:", error);
    return { success: false, error: "Failed to create grant" };
  }
}

export async function getGrants(limit: number = 10, offset: number = 0) {
  try {
    const grants = await prisma.grant.findMany({
      include: {
        creator: {
          select: {
            name: true,
            companyName: true,
          },
        },
      },
      orderBy: {
        deadline: "asc",
      },
      take: limit,
      skip: offset,
    });

    const total = await prisma.grant.count();

    return { success: true, grants, total };
  } catch (error) {
    console.error("Error fetching grants:", error);
    return { success: false, error: "Failed to fetch grants" };
  }
}

export async function getGrantById(grantId: string) {
  try {
    const grant = await prisma.grant.findUnique({
      where: {
        id: grantId,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            companyName: true,
            email: true,
            bio: true,
            website: true,
          },
        },
      },
    });

    if (!grant) {
      return { success: false, error: "Grant not found" };
    }

    return { success: true, grant };
  } catch (error) {
    console.error("Error fetching grant:", error);
    return { success: false, error: "Failed to fetch grant" };
  }
}

export async function getGrantsByCreator(creatorId: string) {
  try {
    const grants = await prisma.grant.findMany({
      where: {
        creatorId,
      },
      orderBy: {
        deadline: "asc",
      },
    });

    return { success: true, grants };
  } catch (error) {
    console.error("Error fetching grants by creator:", error);
    return { success: false, error: "Failed to fetch grants" };
  }
}