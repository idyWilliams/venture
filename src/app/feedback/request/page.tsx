"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function ExpertFeedbackRequestPage() {
  const router = useRouter();
  const [projectId, setProjectId] = useState('');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [feedbackType, setFeedbackType] = useState('expert');
  const [specificQuestions, setSpecificQuestions] = useState('');
  const [includeAIAnalysis, setIncludeAIAnalysis] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Mock projects for the demo
  const userProjects = [
    {
      id: 'proj-1',
      title: 'EcoTech Energy Solutions',
      description: 'Renewable energy storage platform for residential use',
      industry: 'Clean Energy',
      stage: 'Seed',
      lastUpdated: '2025-04-12T14:30:00Z'
    },
    {
      id: 'proj-2',
      title: 'MediConnect Health Platform',
      description: 'AI-powered telehealth solution for rural communities',
      industry: 'HealthTech',
      stage: 'Pre-seed',
      lastUpdated: '2025-03-28T10:15:00Z'
    },
    {
      id: 'proj-3',
      title: 'FinTrack Analytics',
      description: 'Financial analytics tools for small businesses',
      industry: 'FinTech',
      stage: 'Seed',
      lastUpdated: '2025-04-03T16:45:00Z'
    }
  ];

  // Mock feedback options for the demo
  const feedbackOptions = [
    {
      id: 'expert',
      title: 'Expert Feedback',
      description: 'Get comprehensive feedback from industry experts and experienced founders',
      price: 199,
      deliveryTime: '3-5 days',
      includes: [
        'Detailed written assessment',
        'Market fit analysis',
        'Business model review',
        'Investment readiness score',
        'Personalized improvement recommendations'
      ]
    },
    {
      id: 'investor',
      title: 'Investor Panel Review',
      description: 'Have your project reviewed by a panel of active venture investors',
      price: 299,
      deliveryTime: '5-7 days',
      includes: [
        'Feedback from 3 active investors',
        'Investment potential assessment',
        'Term sheet recommendations',
        'Valuation guidance',
        'Investor matching suggestions'
      ]
    },
    {
      id: 'ai',
      title: 'AI-Powered Analysis',
      description: 'Get instant feedback through our advanced AI analysis system',
      price: 49,
      deliveryTime: 'Instant',
      includes: [
        'Automated pitch deck review',
        'Market opportunity assessment',
        'Competitive analysis',
        'Investment readiness score',
        'Key areas for improvement'
      ]
    }
  ];

  const handleSelectProject = (project: any) => {
    setProjectId(project.id);
    setSelectedProject(project);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // In a real implementation, this would be a server request
      // await fetch('/api/feedback/request', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     projectId,
      //     feedbackType,
      //     specificQuestions,
      //     includeAIAnalysis
      //   })
      // });

      // Simulate network delay
      setTimeout(() => {
        setSubmitted(true);
        setSubmitting(false);
      }, 1500);
    } catch (err) {
      console.error('Error submitting feedback request:', err);
      setSubmitting(false);
      alert('Failed to submit feedback request. Please try again.');
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-3xl">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <CardTitle className="text-2xl">Feedback Request Submitted!</CardTitle>
            <CardDescription className="text-lg">
              Your request for expert feedback has been received
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">
              Our team will review your project and provide detailed feedback based on your request.
              You will receive a notification when your feedback is ready.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-medium mb-2">Request Details</h3>
              <div className="text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Project:</span>
                  <span className="font-medium">{selectedProject?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Feedback Type:</span>
                  <span className="font-medium">
                    {feedbackOptions.find(opt => opt.id === feedbackType)?.title}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expected Delivery:</span>
                  <span className="font-medium">
                    {feedbackOptions.find(opt => opt.id === feedbackType)?.deliveryTime}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/dashboard">
                <Button className="w-full">Go to Dashboard</Button>
              </Link>
              <Link href={`/projects/${projectId}`}>
                <Button variant="outline" className="w-full">View Project</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Request Expert Feedback</h1>
        <p className="text-gray-600">
          Get valuable insights and recommendations to improve your startup project
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Select Your Project</CardTitle>
                <CardDescription>
                  Choose the project you'd like to receive feedback on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProjects.map(project => (
                    <div
                      key={project.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        projectId === project.id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handleSelectProject(project)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{project.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        {projectId === project.id && (
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>{project.industry}</span>
                        <span>•</span>
                        <span>{project.stage}</span>
                        <span>•</span>
                        <span>Last updated: {new Date(project.lastUpdated).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Choose Feedback Type</CardTitle>
                <CardDescription>
                  Select the type of feedback that best fits your needs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs 
                  defaultValue={feedbackType}
                  onValueChange={(value) => setFeedbackType(value)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="expert">Expert</TabsTrigger>
                    <TabsTrigger value="investor">Investor</TabsTrigger>
                    <TabsTrigger value="ai">AI Analysis</TabsTrigger>
                  </TabsList>
                  
                  {feedbackOptions.map(option => (
                    <TabsContent key={option.id} value={option.id}>
                      <div className="bg-white border rounded-lg p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold">{option.title}</h3>
                            <p className="text-gray-600 mt-1">{option.description}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold">${option.price}</span>
                            <p className="text-sm text-gray-500">Delivery: {option.deliveryTime}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <h4 className="font-medium mb-2">What's included:</h4>
                          <ul className="space-y-2">
                            {option.includes.map((item, index) => (
                              <li key={index} className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500 mr-2 flex-shrink-0">
                                  <circle cx="12" cy="12" r="10"/>
                                  <path d="M8 12l2 2 4-4"/>
                                </svg>
                                <span>{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
                <CardDescription>
                  Provide any specific areas you'd like the feedback to focus on
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="specificQuestions">Specific Questions or Focus Areas</Label>
                    <Textarea
                      id="specificQuestions"
                      value={specificQuestions}
                      onChange={(e) => setSpecificQuestions(e.target.value)}
                      placeholder="E.g., Is my revenue model viable? How can I improve my go-to-market strategy? What are potential risks in my approach?"
                      className="min-h-[120px] mt-2"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="includeAI"
                      checked={includeAIAnalysis}
                      onChange={(e) => setIncludeAIAnalysis(e.target.checked)}
                    />
                    <Label htmlFor="includeAI">Include AI analysis with expert feedback</Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button type="submit" disabled={!projectId || submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback Request'}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>
        
        <div>
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>Why Get Expert Feedback?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Unbiased Perspective</h3>
                    <p className="text-sm text-gray-600">
                      Get honest feedback from industry experts who can objectively evaluate your project.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Identify Blind Spots</h3>
                    <p className="text-sm text-gray-600">
                      Discover critical issues or opportunities that you might have overlooked.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                      <line x1="12" y1="20" x2="12" y2="10"/>
                      <line x1="18" y1="20" x2="18" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="16"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Improve Investment Readiness</h3>
                    <p className="text-sm text-gray-600">
                      Get guidance on how to make your project more attractive to potential investors.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-600">
                      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Validate Your Approach</h3>
                    <p className="text-sm text-gray-600">
                      Confirm that your business model, market strategy, and value proposition are sound.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium mb-2">Customer Success Stories</h3>
                <div className="bg-gray-50 rounded-lg p-4 italic text-sm">
                  "The expert feedback I received through VentureHive was instrumental in refining our pitch deck and business model. Within two months, we secured our seed round."
                  <div className="mt-2 font-medium not-italic">— Michael Chen, Founder at DataSense</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}