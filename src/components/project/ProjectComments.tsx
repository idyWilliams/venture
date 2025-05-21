"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/src/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
// import { formatDate } from "@/lib/utils";
import CommentModerator from "@/src/components/moderation/CommentModerator";

 const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString("en-US", {
     year: "numeric",
     month: "short",
     day: "numeric",
   });
 };

interface User {
  id: string;
  name: string;
  profileImage: string | null;
  role: "founder" | "investor" | "ADMIN";
}

interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  replies: Comment[];
}

interface ProjectCommentsProps {
  comments: Comment[];
  onAddComment: (content: string, parentId?: string) => Promise<void>;
}

export default function ProjectComments({
  comments,
  onAddComment,
}: ProjectCommentsProps) {
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: string;
    userName: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moderationResult, setModerationResult] = useState<{
    isFlagged: boolean;
    reasons: string[];
  } | null>(null);

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment, replyTo?.id);
      setNewComment("");
      setReplyTo(null);
      setModerationResult(null);
    } catch (error) {
      console.error("Failed to submit comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setNewComment("");
    setModerationResult(null);
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => (
    <div
      className={`mb-6 ${
        depth > 0 ? "ml-8 border-l-2 border-gray-100 pl-6" : ""
      }`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            {comment.user.profileImage ? (
              <img
                src={comment.user.profileImage}
                alt={comment.user.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            )}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex items-center">
            <h4 className="font-medium">{comment.user.name}</h4>
            <span className="text-xs text-gray-500 ml-2">
              {formatDate(comment.createdAt)}
            </span>
            {comment.user.role === "founder" && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                Founder
              </span>
            )}
            {comment.user.role === "investor" && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                Investor
              </span>
            )}
          </div>

          <div className="mt-1 text-gray-700">{comment.content}</div>

          <div className="mt-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-gray-500 hover:text-gray-900"
              onClick={() => {
                setReplyTo({ id: comment.id, userName: comment.user.name });
                // Focus the textarea
                const textarea = document.getElementById("comment-textarea");
                if (textarea) {
                  textarea.focus();
                }
              }}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>

      {/* Render replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Comments</h3>

          <div className="mb-6">
            <div className="mb-2">
              {replyTo && (
                <div className="text-sm text-gray-600 mb-1">
                  Replying to{" "}
                  <span className="font-medium">{replyTo.userName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={handleCancelReply}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    <span className="sr-only">Cancel reply</span>
                  </Button>
                </div>
              )}

              <Textarea
                id="comment-textarea"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="resize-none"
              />

              {/* Moderation component for real-time feedback */}
              {newComment.length > 0 && (
                <CommentModerator
                  content={newComment}
                  onModerationResult={setModerationResult}
                />
              )}

              {moderationResult && moderationResult.isFlagged && (
                <div className="mt-2 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  <p className="font-medium">
                    Your comment may violate our community guidelines:
                  </p>
                  <ul className="mt-1 list-disc list-inside">
                    {moderationResult.reasons.map((reason, index) => (
                      <li key={index}>{reason}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmitComment}
                disabled={
                  isSubmitting ||
                  !newComment.trim() ||
                  (moderationResult && moderationResult.isFlagged)!
                }
              >
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          </div>

          <div className="border-t pt-6">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mx-auto mb-4 text-gray-400"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <p>No comments yet. Be the first to comment!</p>
              </div>
            ) : (
              <div>
                {comments.map((comment) => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
