import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/db';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';

// Schema validation for project creation
const projectSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(300),
  pitch: z.string().min(50),
  industry: z.string().min(1),
  fundingStage: z.string().min(1),
  fundingAmount: z.number().optional(),
  equity: z.number().optional(),
  website: z.string().url().optional().or(z.literal('')),
  demo: z.string().url().optional().or(z.literal('')),
  deck: z.string().url().optional().or(z.literal('')),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET all projects with optional filters
  if (req.method === 'GET') {
    try {
      const { 
        industry, 
        fundingStage, 
        search, 
        limit = '10', 
        offset = '0' 
      } = req.query;

      const filters: any = {};
      
      if (industry) {
        filters.industry = industry as string;
      }
      
      if (fundingStage) {
        filters.fundingStage = fundingStage as string;
      }
      
      if (search) {
        filters.OR = [
          { title: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      const projects = await prisma.project.findMany({
        where: filters,
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              openForContact: true,
            },
          },
          _count: {
            select: {
              views: true,
              comments: true,
              likes: true,
            },
          },
        },
        take: parseInt(limit as string),
        skip: parseInt(offset as string),
        orderBy: {
          createdAt: 'desc',
        },
      });

      const totalCount = await prisma.project.count({
        where: filters,
      });

      return res.status(200).json({
        projects,
        totalCount,
        hasMore: parseInt(offset as string) + parseInt(limit as string) < totalCount,
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects' });
    }
  }

  // POST create a new project
  if (req.method === 'POST') {
    try {
      const userId = session.user.id;
      
      // Check if user is a founder
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });

      if (!user || user.role !== 'FOUNDER') {
        return res.status(403).json({ error: 'Only founders can create projects' });
      }

      // Validate request body
      const validationResult = projectSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: 'Invalid project data', 
          details: validationResult.error.format() 
        });
      }

      const data = validationResult.data;
      
      // Create project
      const project = await prisma.project.create({
        data: {
          title: data.title,
          description: data.description,
          pitch: data.pitch,
          industry: data.industry,
          fundingStage: data.fundingStage,
          fundingAmount: data.fundingAmount,
          equity: data.equity,
          website: data.website || null,
          demo: data.demo || null,
          deck: data.deck || null,
          founderUserId: userId,
        },
        include: {
          founder: {
            select: {
              id: true,
              name: true,
              companyName: true,
              profileImage: true,
              openForContact: true,
            },
          },
        },
      });

      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(500).json({ error: 'Failed to create project' });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
