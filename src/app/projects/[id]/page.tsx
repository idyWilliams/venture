'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import ProjectDetails from '@/src/components/project/ProjectDetails';
import ProjectComments from '@/src/components/project/ProjectComments';
import ProjectFAQ from '@/src/components/project/ProjectFAQ';
import ProjectCommunity from '@/src/components/project/ProjectCommunity';
import ContactRequestForm from '@/src/components/engagement/ContactRequestForm';
import { subscribeToProjectActivity } from '@/src/lib/pusher';

// Mock project data - in a real app, this would come from an API call
const mockProject = {
  id: '1',
  title: 'AI-Powered Healthcare Assistant',
  description: 'A mobile app that uses artificial intelligence to provide personalized healthcare recommendations and monitoring.',
  pitch: 'Our AI-powered healthcare assistant is revolutionizing personalized healthcare by providing real-time monitoring, personalized recommendations, and early warning detection for health issues. We combine machine learning with medical expertise to deliver a solution that helps users stay healthier longer.',
  industry: 'Healthcare',
  fundingStage: 'Seed',
  fundingAmount: 500000,
  equity: 10,
  website: 'https://healthtech-ai.example.com',
  demo: 'https://demo.healthtech-ai.example.com',
  deck: null,
  logo: null,
  createdAt: '2023-05-15T00:00:00.000Z',
  updatedAt: '2023-05-15T00:00:00.000Z',
  founder: {
    id: 'f1',
    name: 'John Smith',
    companyName: 'HealthTech AI',
    profileImage: null,
    openForContact: true,
  },
  stats: {
    views: 127,
    likes: 42,
    comments: 18,
  }
};

// Mock FAQs
const mockFAQs = [
  {
    id: '1',
    question: 'What problem does your product solve?',
    answer: 'Our AI-powered healthcare assistant addresses the challenge of preventative healthcare monitoring and personalized health recommendations. Many individuals don\'t get regular health check-ups or have difficulty managing chronic conditions. Our solution provides continuous monitoring and actionable insights to improve health outcomes.',
  },
  {
    id: '2',
    question: 'What\'s your go-to-market strategy?',
    answer: 'We\'re pursuing a B2B2C approach, partnering with health insurance providers who will offer our platform as a value-added service to their customers. We\'re also developing direct consumer channels through app stores and targeted digital marketing.',
  },
  {
    id: '3',
    question: 'How do you handle user data privacy?',
    answer: 'Privacy is at the core of our design. We\'re HIPAA compliant, employ end-to-end encryption, and give users complete control over their data sharing preferences. We never sell user data and maintain strict access controls within our organization.',
  }
];

// Mock comments
const mockComments = [
  {
    id: '1',
    content: 'This is a really promising solution for preventative healthcare. Have you considered partnering with hospital networks?',
    user: {
      id: 'u1',
      name: 'Sarah Johnson',
      profileImage: null,
      role: 'INVESTOR'
    },
    createdAt: '2023-05-20T14:30:00.000Z',
    replies: [
      {
        id: '2',
        content: 'Thanks Sarah! Yes, we\'re in discussions with two major hospital networks for pilot programs starting Q3 this year.',
        user: {
          id: 'f1',
          name: 'John Smith',
          profileImage: null,
          role: 'FOUNDER'
        },
        createdAt: '2023-05-20T16:45:00.000Z',
      }
    ]
  },
  {
    id: '3',
    content: 'What ML models are you using for the predictive health analytics component?',
    user: {
      id: 'u2',
      name: 'Michael Wong',
      profileImage: null,
      role: 'INVESTOR'
    },
    createdAt: '2023-05-22T09:15:00.000Z',
    replies: []
  }
];

export default function ProjectPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState(mockProject);
  const [faqs, setFaqs] = useState(mockFAQs);
  const [comments, setComments] = useState(mockComments);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [userRole, setUserRole] = useState<'FOUNDER' | 'INVESTOR'>('INVESTOR'); // For demo purposes

  // In a real app, fetch project data from the API
  useEffect(() => {
    // Simulate API calls
    // fetchProject(projectId).then(setProject);
    // fetchProjectFAQs(projectId).then(setFaqs);
    // fetchProjectComments(projectId).then(setComments);
    // checkLikeStatus(projectId).then(setIsLiked);
    // checkSaveStatus(projectId).then(setIsSaved);
    // getCurrentUserRole().then(setUserRole);

    // Record a view - in a real app, this would be an API call
    const recordView = async () => {
      try {
        // await fetch(`/api/projects/${projectId}/view`, { method: 'POST' });
        console.log('View recorded');
      } catch (error) {
        console.error('Failed to record view:', error);
      }
    };

    recordView();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProjectActivity(projectId, (data) => {
      console.log('Project activity:', data);

      // Update the UI based on the activity type
      if (data.type === 'new-comment') {
        // Fetch latest comments
        // fetchProjectComments(projectId).then(setComments);
      } else if (data.type === 'new-like') {
        // Update like count
        setProject(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            likes: prev.stats.likes + 1
          }
        }));
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [projectId]);

  const handleLikeToggle = async () => {
    setIsLiked(!isLiked);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/projects/${projectId}/like`, {
      //   method: isLiked ? 'DELETE' : 'POST',
      // });

      // Update like count
      setProject(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          likes: isLiked ? prev.stats.likes - 1 : prev.stats.likes + 1
        }
      }));
    } catch (error) {
      // Revert on error
      setIsLiked(!isLiked);
      console.error('Failed to toggle like:', error);
    }
  };

  const handleSaveToggle = async () => {
    setIsSaved(!isSaved);

    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/projects/${projectId}/save`, {
      //   method: isSaved ? 'DELETE' : 'POST',
      // });
    } catch (error) {
      // Revert on error
      setIsSaved(!isSaved);
      console.error('Failed to toggle save:', error);
    }
  };

  const handleContactRequest = async (message: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/contact`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     recipientId: project.founder.id,
      //     message
      //   }),
      // });

      setShowContactModal(false);
      // Show success message
    } catch (error) {
      console.error('Failed to send contact request:', error);
      // Show error message
    }
  };

  const handleAddComment = async (content: string, parentId?: string) => {
    try {
      // In a real app, this would be an API call
      // const response = await fetch(`/api/projects/${projectId}/comments`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content,
      //     parentId
      //   }),
      // });

      // const newComment = await response.json();

      // For demonstration, we'll create a mock new comment
      const newComment = {
        id: Date.now().toString(),
        content,
        user: {
          id: 'current-user',
          name: userRole === 'FOUNDER' ? 'You (Founder)' : 'You (Investor)',
          profileImage: null,
          role: userRole
        },
        createdAt: new Date().toISOString(),
        replies: []
      };

      if (parentId) {
        // Add reply to existing comment
        setComments(comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment]
            };
          }
          return comment;
        }));
      } else {
        // Add new top-level comment
        setComments([...comments, newComment]);
      }

      // Update comment count
      setProject(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          comments: prev.stats.comments + 1
        }
      }));
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const isFounder = userRole === 'FOUNDER' && project.founder.id === 'current-user';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Project details */}
        <div className="lg:col-span-2">
          <ProjectDetails
            project={project}
            isLiked={isLiked}
            isSaved={isSaved}
            onLikeToggle={handleLikeToggle}
            onSaveToggle={handleSaveToggle}
          />

          <div className="mt-8">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="comments">
                  Comments ({project.stats.comments})
                </TabsTrigger>
                <TabsTrigger value="faqs">FAQs</TabsTrigger>
                <TabsTrigger value="community">Community</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <Card className="p-6">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold mb-4">Pitch</h3>
                    <p className="text-gray-700 whitespace-pre-line">{project.pitch}</p>

                    <h3 className="text-xl font-semibold mt-8 mb-4">About</h3>
                    <p className="text-gray-700">{project.description}</p>

                    <div className="mt-8 grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Industry</h4>
                        <p className="mt-1">{project.industry}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Funding Stage</h4>
                        <p className="mt-1">{project.fundingStage}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Seeking</h4>
                        <p className="mt-1">${project.fundingAmount?.toLocaleString()}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Equity Offered</h4>
                        <p className="mt-1">{project.equity}%</p>
                      </div>
                    </div>

                    {(project.website || project.demo || project.deck) && (
                      <div className="mt-8">
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Resources</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.website && (
                            <a
                              href={project.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                              </svg>
                              Website
                            </a>
                          )}

                          {project.demo && (
                            <a
                              href={project.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polygon points="23 7 16 12 23 17 23 7"></polygon>
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                              </svg>
                              Demo
                            </a>
                          )}

                          {project.deck && (
                            <a
                              href={project.deck}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 hover:bg-gray-200"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                              Pitch Deck
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="comments" className="mt-6">
                <ProjectComments
                  //@ts-ignore
                  comments={comments}
                  onAddComment={handleAddComment}
                />
              </TabsContent>

              <TabsContent value="faqs" className="mt-6">
                <ProjectFAQ
                  faqs={faqs}
                  isFounder={isFounder}
                  onAddFAQ={(question, answer) => {
                    const newFAQ = {
                      id: Date.now().toString(),
                      question,
                      answer
                    };
                    setFaqs([...faqs, newFAQ]);
                  }}
                  onUpdateFAQ={(id, question, answer) => {
                    setFaqs(faqs.map(faq =>
                      faq.id === id ? { ...faq, question, answer } : faq
                    ));
                  }}
                  onDeleteFAQ={(id) => {
                    setFaqs(faqs.filter(faq => faq.id !== id));
                  }}
                />
              </TabsContent>

              <TabsContent value="community" className="mt-6">
                <ProjectCommunity projectId={projectId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Founder info */}
          <Card className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-4">
                {project.founder.profileImage ? (
                  <img
                    src={project.founder.profileImage}
                    alt={project.founder.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                )}
              </div>
              <div>
                <h3 className="font-medium">{project.founder.name}</h3>
                <p className="text-sm text-gray-500">{project.founder.companyName}</p>
              </div>
            </div>

            {userRole === 'INVESTOR' && (
              <div className="mt-6">
                <Button
                  onClick={() => setShowContactModal(true)}
                  className="w-full"
                  disabled={!project.founder.openForContact}
                >
                  {project.founder.openForContact ? 'Request to Contact' : 'Not Available for Contact'}
                </Button>
                {!project.founder.openForContact && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    The founder is not currently open to direct contact
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Project stats */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Project Engagement</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{project.stats.views}</div>
                <div className="text-xs text-gray-500">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{project.stats.likes}</div>
                <div className="text-xs text-gray-500">Likes</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{project.stats.comments}</div>
                <div className="text-xs text-gray-500">Comments</div>
              </div>
            </div>
          </Card>

          {/* Similar projects */}
          <Card className="p-6">
            <h3 className="font-medium mb-4">Similar Projects</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3"></div>
                <div>
                  <h4 className="font-medium text-sm">MedTech Monitoring Platform</h4>
                  <p className="text-xs text-gray-500">Medical Devices • Pre-seed</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3"></div>
                <div>
                  <h4 className="font-medium text-sm">HealthData Analytics</h4>
                  <p className="text-xs text-gray-500">Healthcare • Seed</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="h-10 w-10 rounded bg-gray-200 flex-shrink-0 mr-3"></div>
                <div>
                  <h4 className="font-medium text-sm">PatientFirst Remote Care</h4>
                  <p className="text-xs text-gray-500">Healthcare • Series A</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Image */}
          <div className="rounded-lg overflow-hidden shadow-md">
            <img
              src="https://pixabay.com/get/g89690a90445fc95b4e56b093a268066bdcee35689c7d5e0ffd31c9b77fbd0edc5c63e423bae68ee33952c82ef6d0bd516c215a0a68a2709cab9786b503baf814_1280.jpg"
              alt="Startup Pitch Meeting"
              className="w-full h-48 object-cover"
            />
          </div>
        </div>
      </div>

      {/* Contact request modal */}
      {showContactModal && (
        <ContactRequestForm
          founderName={project.founder.name}
          onSubmit={handleContactRequest}
          onCancel={() => setShowContactModal(false)}
        />
      )}
    </div>
  );
}
