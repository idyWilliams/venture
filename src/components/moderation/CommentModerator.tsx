'use client';

import { useState, useEffect } from 'react';

interface CommentModeratorProps {
  content: string;
  onModerationResult: (result: { isFlagged: boolean; reasons: string[] }) => void;
}

export default function CommentModerator({ content, onModerationResult }: CommentModeratorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ isFlagged: boolean; reasons: string[] } | null>(null);

  useEffect(() => {
    // Debounce the API call to avoid too many requests while typing
    const debounceTimeout = setTimeout(() => {
      if (content.trim().length < 5) return;
      
      const analyzeContent = async () => {
        setIsAnalyzing(true);
        try {
          // In a real app, this would be an API call to your moderation endpoint
          const response = await fetch('/api/comments/moderate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content }),
          });
          
          if (!response.ok) {
            throw new Error('Moderation service failed');
          }
          
          const data = await response.json();
          
          setResult({
            isFlagged: data.isFlagged,
            reasons: data.reasons || [],
          });
          
          onModerationResult({
            isFlagged: data.isFlagged,
            reasons: data.reasons || [],
          });
        } catch (error) {
          console.error('Error during comment moderation:', error);
          // Default to not flagged in case of error to avoid blocking submission
          setResult({ isFlagged: false, reasons: [] });
          onModerationResult({ isFlagged: false, reasons: [] });
        } finally {
          setIsAnalyzing(false);
        }
      };
      
      analyzeContent();
    }, 500); // 500ms debounce
    
    return () => clearTimeout(debounceTimeout);
  }, [content, onModerationResult]);

  // Component doesn't render anything visible - it just performs analysis
  // and calls the provided callback with results
  return isAnalyzing ? (
    <div className="flex items-center mt-2 text-sm text-gray-500">
      <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent mr-2"></div>
      Checking content...
    </div>
  ) : null;
}
