"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useUserRole } from "@/contexts/UserRoleContext";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Users,
  BarChart3,
  MessageSquare,
  FileUp,
  DollarSign,
  Zap,
  Building,
  Lightbulb,
  Search,
} from "lucide-react";
import CreateDealRoomModal from "@/components/deal-room/CreateDealRoomModal";

interface QuickActionProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  highlight?: boolean;
}

const QuickAction: React.FC<QuickActionProps> = ({
  title,
  icon,
  onClick,
  highlight = false,
}) => {
  return (
    <Button
      variant={highlight ? "default" : "outline"}
      className="h-auto py-4 px-4 flex flex-col items-center justify-center gap-2 w-24 sm:w-28"
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className="text-xs text-center">{title}</span>
    </Button>
  );
};

export function QuickActions() {
  const router = useRouter();
  const { role, isAuthenticated } = useUserRole();
  const [showDealRoomModal, setShowDealRoomModal] = React.useState(false);

  const isFounder = role === 'founder';
  const isInvestor = role === 'investor';

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="w-full overflow-auto">
      <div className="flex space-x-2 p-2 min-w-max">
        {isFounder && (
          <>
            <QuickAction
              title="New Project"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => router.push('/projects/create')}
              highlight
            />
            <QuickAction
              title="Find Investors"
              icon={<Search className="h-5 w-5" />}
              onClick={() => router.push('/matchmaking')}
            />
            <QuickAction
              title="Deal Room"
              icon={<Users className="h-5 w-5" />}
              onClick={() => setShowDealRoomModal(true)}
            />
            <QuickAction
              title="Analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              onClick={() => router.push('/analytics/dashboard')}
            />
            <QuickAction
              title="Pitch Deck"
              icon={<FileUp className="h-5 w-5" />}
              onClick={() => router.push('/projects/pitch')}
            />
            <QuickAction
              title="Subscription"
              icon={<DollarSign className="h-5 w-5" />}
              onClick={() => router.push('/payment/checkout?plan=founder-pro&price=69&subscription=true')}
            />
            <QuickAction
              title="Accelerators"
              icon={<Zap className="h-5 w-5" />}
              onClick={() => router.push('/accelerators')}
            />
          </>
        )}

        {isInvestor && (
          <>
            <QuickAction
              title="Discover"
              icon={<Search className="h-5 w-5" />}
              onClick={() => router.push('/projects')}
              highlight
            />
            <QuickAction
              title="Deal Room"
              icon={<Users className="h-5 w-5" />}
              onClick={() => setShowDealRoomModal(true)}
            />
            <QuickAction
              title="Portfolio"
              icon={<Building className="h-5 w-5" />}
              onClick={() => router.push('/investor/portfolio')}
            />
            <QuickAction
              title="Analytics"
              icon={<BarChart3 className="h-5 w-5" />}
              onClick={() => router.push('/analytics/dashboard')}
            />
            <QuickAction
              title="Messages"
              icon={<MessageSquare className="h-5 w-5" />}
              onClick={() => router.push('/messages')}
            />
            <QuickAction
              title="Insights"
              icon={<Lightbulb className="h-5 w-5" />}
              onClick={() => router.push('/investor/insights')}
            />
            <QuickAction
              title="Subscription"
              icon={<DollarSign className="h-5 w-5" />}
              onClick={() => router.push('/payment/checkout?plan=investor&price=149&subscription=true')}
            />
          </>
        )}
      </div>

      {showDealRoomModal && (
        <CreateDealRoomModal
          trigger={<></>}
        />
      )}
    </div>
  );
}