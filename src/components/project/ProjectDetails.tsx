'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  fundingStage: string;
  fundingAmount?: number;
  equity?: number;
  logo?: string | null;
  createdAt: string;
  updatedAt: string;
  founder: {
    id: string;
    name: string;
    companyName?: string;
    profileImage?: string | null;
    openForContact: boolean;
  };
  stats: {
    views: number;
    likes: number;
    comments: number;
  };
}

interface ProjectDetailsProps {
  project: Project;
  isLiked: boolean;
  isSaved: boolean;
  onLikeToggle: () => void;
  onSaveToggle: () => void;
}

export default function ProjectDetails({ 
  project, 
  isLiked, 
  isSaved, 
  onLikeToggle,
  onSaveToggle
}: ProjectDetailsProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{project.title}</h1>
            <div className="mt-2 space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {project.industry}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {project.fundingStage}
              </span>
              {project.fundingAmount && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  ${project.fundingAmount.toLocaleString()}
                </span>
              )}
              {project.equity && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {project.equity}% equity
                </span>
              )}
            </div>
            <p className="mt-4 text-gray-600">{project.description}</p>
            
            <div className="mt-6 flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                  {project.founder.profileImage ? (
                    <img
                      src={project.founder.profileImage}
                      alt={project.founder.name}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  )}
                </div>
                <span>{project.founder.name}</span>
              </div>
              {project.founder.companyName && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <span>{project.founder.companyName}</span>
                </>
              )}
              <span className="mx-2 text-gray-300">•</span>
              <span>Updated {formatDate(project.updatedAt)}</span>
            </div>
          </div>
          
          {project.logo && (
            <div className="ml-6">
              <div className="h-24 w-24 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                <img 
                  src={project.logo} 
                  alt={`${project.title} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLikeToggle}
            className={`gap-2 ${isLiked ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700' : ''}`}
          >
            {isLiked ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            )}
            <span>Like</span>
            <span className="text-gray-500">({project.stats.likes})</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onSaveToggle}
            className={`gap-2 ${isSaved ? 'text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700' : ''}`}
          >
            {isSaved ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            )}
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </Button>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            <span>{project.stats.views} views</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
