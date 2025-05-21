"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUserRole } from "@/src/contexts/UserRoleContext";
import { useApiQuery, useApiMutation } from "@/src/hooks/useApi";
import { DealRoom, DealRoomStatus } from "@/src/lib/services/dealRoomService";
import DealRoomLayout from "@/src/components/deal-room/DealRoomLayout";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Alert, AlertDescription, AlertTitle } from "@/src/components/ui/alert";

export default function DealRoomDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dealRoomId = params.id as string;
  const { role } = useUserRole();
  const [error, setError] = useState<Error | null>(null);

  // Using test user IDs for demo purposes
  // In a real app, this would come from authentication
  const userId = role === "founder" ? "founder-1" : "investor-1";
  const userName = role === "founder" ? "John Founder" : "Jane Investor";

  // Fetch deal room details
  const {
    data: dealRoom,
    isLoading,
    error: fetchError,
    refetch,
  } = useApiQuery<DealRoom>(
    `/api/deal-rooms/${dealRoomId}`,
    ["deal-room", dealRoomId],
    undefined,
    {
      enabled: !!dealRoomId,
      refetchInterval: 30000, // Refetch every 30 seconds to keep chat updated
      // retry: 3,
      onError: (err) => {
        setError(err);
      },
    }
  );

  // Reset error state when dealRoomId changes
  useEffect(() => {
    setError(null);
  }, [dealRoomId]);

  // Mutation for updating deal status
  const updateStatusMutation = useApiMutation<
    DealRoom,
    {
      action: "updateStatus";
      status: DealRoomStatus;
      userId: string;
      userName: string;
      userRole: "founder" | "investor";
    }
  >("put", `/api/deal-rooms/${dealRoomId}`, {
    invalidateQueries: [["deal-room", dealRoomId]],
    onError: (err) => {
      setError(err);
    },
  });

  // Mutation for archiving/unarchiving
  const toggleArchiveMutation = useApiMutation<
    DealRoom,
    {
      action: "toggleArchive";
      userId: string;
      userName: string;
      isArchived: boolean;
    }
  >("put", `/api/deal-rooms/${dealRoomId}`, {
    invalidateQueries: [["deal-room", dealRoomId], ["deal-rooms"]],
    onError: (err) => {
      setError(err);
    },
    onSuccess: () => {
      // Optionally redirect to deal rooms list after archiving
      // if (dealRoom?.isArchived === false) {
        // Only redirect if we're archiving, not unarchiving
        // router.push('/deal-rooms');
      // }
    },
  });

  // Handle status update
  const handleUpdateStatus = (newStatus: string) => {
    try {
      updateStatusMutation.mutate({
        action: "updateStatus",
        status: newStatus as DealRoomStatus,
        userId,
        userName,
        userRole: role as "founder" | "investor",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to update status")
      );
    }
  };

  // Handle archive toggle
  const handleArchiveToggle = () => {
    if (!dealRoom) return;

    try {
      toggleArchiveMutation.mutate({
        action: "toggleArchive",
        userId,
        userName,
        // isArchived: !dealRoom.isArchived,
        isArchived: false,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to toggle archive status")
      );
    }
  };

  // Combine errors from different sources
  const combinedError = error || fetchError;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        <span className="ml-2 text-gray-600">Loading deal room...</span>
      </div>
    );
  }

  if (combinedError || !dealRoom) {
    return (
      <div className="flex justify-center items-center min-h-screen text-center">
        <div className="max-w-md w-full px-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">
            Error loading deal room
          </h3>
          <p className="text-gray-600 mb-4">
            {combinedError?.message ||
              "There was a problem fetching the deal room details. Please try again."}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Check if user has access to this deal room
  const hasAccess = true;
    // dealRoom.founderIds?.includes(userId) ||
    // dealRoom.investorIds?.includes(userId) ||
    // role === "founder";

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-md w-full px-4">
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You do not have permission to view this deal room.
            </AlertDescription>
          </Alert>
          <Button onClick={() => router.push("/deal-rooms")}>
            Return to Deal Rooms
          </Button>
        </div>
      </div>
    );
  }

  // If there are pending mutations, we can show a status indicator
  const isPending =
    updateStatusMutation.isPending || toggleArchiveMutation.isPending;

  return (
    <>
      {isPending && (
        <div className="fixed top-4 right-4 bg-blue-50 text-blue-700 px-4 py-2 rounded-md flex items-center shadow-md z-50">
          <Loader2 className="animate-spin h-4 w-4 mr-2" />
          <span>Updating...</span>
        </div>
      )}

      <DealRoomLayout
        //@ts-ignore
        dealRoom={dealRoom}
        currentUserId={userId}
        currentUserRole={role as "founder" | "investor"}
        onUpdateStatus={handleUpdateStatus}
        onArchive={handleArchiveToggle}
      />
    </>
  );
}
