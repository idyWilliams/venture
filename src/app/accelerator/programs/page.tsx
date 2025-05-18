"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';

interface AcceleratorProgram {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  location?: string;
  remote: boolean;
  equity?: number;
  funding?: number;
  manager: {
    name: string;
    companyName?: string;
  };
}

export default function AcceleratorProgramsPage() {
  const [programs, setPrograms] = useState<AcceleratorProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchAcceleratorPrograms = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be a server fetch
        // const response = await fetch('/api/accelerator/programs');
        // const data = await response.json();

        // For this demo, we'll use mock data
        const mockPrograms: AcceleratorProgram[] = [
          {
            id: 'prog-1',
            name: 'TechStars AI Accelerator',
            description: 'A 3-month intensive program for AI startups looking to scale.',
            startDate: '2025-07-01T00:00:00Z',
            endDate: '2025-09-30T00:00:00Z',
            location: 'San Francisco, CA',
            remote: true,
            equity: 6,
            funding: 120000,
            manager: {
              name: 'TechStars',
              companyName: 'TechStars Inc.'
            }
          },
          {
            id: 'prog-2',
            name: 'Climate Tech Innovation Program',
            description: 'Supporting startups focused on solving climate change challenges.',
            startDate: '2025-08-15T00:00:00Z',
            endDate: '2025-12-15T00:00:00Z',
            location: 'Boston, MA',
            remote: false,
            equity: 5,
            funding: 150000,
            manager: {
              name: 'GreenFuture Ventures',
              companyName: 'GreenFuture Capital'
            }
          },
          {
            id: 'prog-3',
            name: 'HealthTech Accelerator',
            description: 'For innovative startups in healthcare and biotech.',
            startDate: '2025-09-01T00:00:00Z',
            endDate: '2026-02-28T00:00:00Z',
            location: 'New York, NY',
            remote: true,
            equity: 7,
            funding: 200000,
            manager: {
              name: 'MedInnovate Partners',
              companyName: 'MedInnovate LLC'
            }
          },
          {
            id: 'prog-4',
            name: 'Fintech Founders Program',
            description: 'Accelerating the next generation of financial technology startups.',
            startDate: '2025-10-01T00:00:00Z',
            endDate: '2026-01-31T00:00:00Z',
            location: 'London, UK',
            remote: true,
            equity: 8,
            funding: 180000,
            manager: {
              name: 'FinForward',
              companyName: 'FinForward Ventures'
            }
          }
        ];

        setTimeout(() => {
          setPrograms(mockPrograms);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching accelerator programs:', err);
        setError('Failed to load accelerator programs');
        setLoading(false);
      }
    };

    fetchAcceleratorPrograms();
  }, []);

  // Filter programs based on search term and industry filter
  const filteredPrograms = programs.filter(program => {
    const matchesSearch = searchTerm === '' ||
      program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = !industryFilter ||
      program.description.toLowerCase().includes(industryFilter.toLowerCase());

    return matchesSearch && matchesIndustry;
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const industries = [
    "AI & Machine Learning",
    "Climate Tech",
    "HealthTech & Biotech",
    "Fintech",
    "SaaS",
    "Hardware",
    "Consumer Tech",
    "Enterprise Software",
    "Social Impact"
  ];

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
            <div className="h-4 w-40 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-32 bg-blue-100 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Accelerator Programs</h1>
        <p className="text-gray-600 mb-6">
          Discover and apply to top accelerator programs to help your startup grow
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2">
            <div className="relative">
              <Input
                type="search"
                placeholder="Search accelerators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
          </div>
          <div>
            <select
              id="industryFilter"
              value={industryFilter || ''}
              onChange={(e) => setIndustryFilter(e.target.value || null)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="">All Industries</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {filteredPrograms.map((program) => (
          <Card key={program.id} className="flex flex-col h-full">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                  {program.remote ? 'Remote Available' : 'In-Person Only'}
                </div>
                {program.equity && (
                  <div className="text-sm text-gray-500">
                    {program.equity}% equity
                  </div>
                )}
              </div>
              <CardTitle>{program.name}</CardTitle>
              <CardDescription>
                {program.manager.companyName || program.manager.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-700 mb-4 text-sm">{program.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span className="font-medium">
                    {formatDate(program.startDate)} - {formatDate(program.endDate)}
                  </span>
                </div>
                {program.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-medium">{program.location}</span>
                  </div>
                )}
                {program.funding && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Funding:</span>
                    <span className="font-medium">${program.funding.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full">
                <Link href={`/accelerator/programs/${program.id}`}>
                  <Button className="w-full">View Program</Button>
                </Link>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">
          Load More Programs
        </Button>
      </div>

      <div className="mt-20 bg-gray-50 p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Run Your Own Accelerator Program</h2>
          <p className="text-gray-600 mb-6">
            Are you a venture capital firm, corporation, or institution looking to launch an accelerator program?
            VentureHive Pro provides tools to help you manage applications, engage with founders, and track portfolio companies.
          </p>
          <Button variant="outline">Create an Accelerator</Button>
        </div>
      </div>
    </div>
  );
}