'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

interface Project {
  id: string;
  title: string;
  description: string;
  industry: string;
  fundingStage: string;
  founderName: string;
  founderCompany: string;
  createdAt: string;
  updatedAt: string;
  fundingAmount?: number;
  equity?: number;
  logo?: string | null;
}

interface ProjectCardProps {
  project: Project;
  isSaved: boolean;
  onSaveToggle: () => void;
}

export default function ProjectCard({ project, isSaved, onSaveToggle }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-start">
        <div className="flex-1">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  <Link href={`/projects/${project.id}`} className="hover:text-blue-600 transition-colors">
                    {project.title}
                  </Link>
                </CardTitle>
                <CardDescription>
                  {project.industry} • {project.fundingStage}
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  onSaveToggle();
                }}
              >
                {isSaved ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                )}
                <span className="sr-only">{isSaved ? 'Unsave' : 'Save'}</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{project.description}</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
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
              
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                Updated {formatDate(project.updatedAt)}
              </span>
            </div>
            
            <div className="mt-4 flex items-center text-sm text-gray-500">
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <span>{project.founderName}</span>
              </div>
              {project.founderCompany && (
                <>
                  <span className="mx-2 text-gray-300">•</span>
                  <span>{project.founderCompany}</span>
                </>
              )}
            </div>
          </CardContent>
        </div>
      </div>
      <CardFooter className="bg-gray-50 flex justify-end">
        <Link href={`/projects/${project.id}`}>
          <Button variant="outline">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
