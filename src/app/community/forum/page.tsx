"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    role: string;
    profileImage?: string;
  };
  tags: string[];
  createdAt: string;
  commentsCount: number;
  viewsCount: number;
  likesCount: number;
  isPinned?: boolean;
}

export default function CommunityForumPage() {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchForumPosts = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would be a server fetch
        // const response = await fetch('/api/community/forum/posts');
        // const data = await response.json();

        // For this demo, we'll use mock data
        const mockPosts: ForumPost[] = [
          {
            id: 'post-1',
            title: "How to approach VCs for a pre-seed round?",
            content: "I'm preparing to raise a pre-seed round for my AI-powered fintech startup. Any advice on how to approach VCs at this stage? Are there specific metrics they want to see?",
            author: {
              id: 'user-1',
              name: 'David Kumar',
              role: 'founder',
              profileImage: '/avatars/david.jpg'
            },
            tags: ['Fundraising', 'Pre-seed', 'Venture Capital'],
            createdAt: '2025-04-22T16:30:00Z',
            commentsCount: 12,
            viewsCount: 158,
            likesCount: 28,
            isPinned: true
          },
          {
            id: 'post-2',
            title: "Term Sheet Red Flags for Founders",
            content: "After going through several term sheets, I wanted to share some red flags that founders should watch out for. Here's what I've learned...",
            author: {
              id: 'user-2',
              name: 'Elena Rodriguez',
              role: 'founder',
              profileImage: '/avatars/elena.jpg'
            },
            tags: ['Term Sheets', 'Legal', 'Fundraising'],
            createdAt: '2025-04-21T14:15:00Z',
            commentsCount: 24,
            viewsCount: 312,
            likesCount: 75
          },
          {
            id: 'post-3',
            title: "Investor Perspective: What Makes a Compelling Pitch Deck",
            content: "As an investor who reviews hundreds of pitch decks monthly, here's what stands out to me and what makes me want to schedule a meeting...",
            author: {
              id: 'user-3',
              name: 'Michael Chen',
              role: 'investor',
              profileImage: '/avatars/michael.jpg'
            },
            tags: ['Pitch Deck', 'Investor Insights', 'Fundraising'],
            createdAt: '2025-04-20T09:45:00Z',
            commentsCount: 19,
            viewsCount: 274,
            likesCount: 63
          },
          {
            id: 'post-4',
            title: "Our Journey Through Y Combinator - Lessons Learned",
            content: "We just completed Y Combinator's Winter 2025 batch, and I wanted to share our experience and key takeaways for other founders considering accelerators...",
            author: {
              id: 'user-4',
              name: 'Sarah Johnson',
              role: 'founder',
              profileImage: '/avatars/sarah.jpg'
            },
            tags: ['Accelerators', 'Y Combinator', 'Founder Story'],
            createdAt: '2025-04-18T11:20:00Z',
            commentsCount: 31,
            viewsCount: 428,
            likesCount: 97
          },
          {
            id: 'post-5',
            title: "How We Pivoted Our Business Model and Tripled Revenue",
            content: "Six months ago, we were struggling to find product-market fit. Here's the story of how we pivoted our business model and the results...",
            author: {
              id: 'user-5',
              name: 'Omar Patel',
              role: 'founder',
              profileImage: '/avatars/omar.jpg'
            },
            tags: ['Product-Market Fit', 'Business Model', 'Growth Strategy'],
            createdAt: '2025-04-17T15:10:00Z',
            commentsCount: 27,
            viewsCount: 336,
            likesCount: 82
          },
          {
            id: 'post-6',
            title: "Due Diligence Checklist for Investors",
            content: "I've created a comprehensive due diligence checklist that we use at our fund. Sharing it here for other investors...",
            author: {
              id: 'user-6',
              name: 'Jennifer Wu',
              role: 'investor',
              profileImage: '/avatars/jennifer.jpg'
            },
            tags: ['Due Diligence', 'Investor Resources', 'Best Practices'],
            createdAt: '2025-04-16T13:40:00Z',
            commentsCount: 16,
            viewsCount: 203,
            likesCount: 54
          }
        ];

        setTimeout(() => {
          setPosts(mockPosts);
          setLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error fetching forum posts:', err);
        setError('Failed to load forum posts');
        setLoading(false);
      }
    };

    fetchForumPosts();
  }, []);

  // Get all unique tags from posts
  const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts based on search term, active tag, and category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTag = !activeTag || post.tags.includes(activeTag);

    const matchesCategory = activeCategory === 'all' ||
      (activeCategory === 'founders' && post.author.role === 'founder') ||
      (activeCategory === 'investors' && post.author.role === 'investor') ||
      (activeCategory === 'pinned' && post.isPinned === true);

    return matchesSearch && matchesTag && matchesCategory;
  });

  // Sort posts with pinned posts first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Format date for display
  const formatDate = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-gray-600">
            Connect, learn, and share with the VentureHive community
          </p>
        </div>
        <Button>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Create New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <Button
                  variant={activeCategory === 'all' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory('all')}
                >
                  All Posts
                </Button>
                <Button
                  variant={activeCategory === 'founders' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory('founders')}
                >
                  Founder Stories
                </Button>
                <Button
                  variant={activeCategory === 'investors' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory('investors')}
                >
                  Investor Insights
                </Button>
                <Button
                  variant={activeCategory === 'pinned' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveCategory('pinned')}
                >
                  Pinned Posts
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    size="sm"
                    variant={activeTag === tag ? 'default' : 'outline'}
                    className="rounded-full"
                    onClick={() => {
                      if (activeTag === tag) {
                        setActiveTag(null);
                      } else {
                        setActiveTag(tag);
                      }
                    }}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content */}
        <div className="md:col-span-3 space-y-6">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search discussions..."
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

          <Tabs defaultValue="latest" className="mb-4">
            <TabsList>
              <TabsTrigger value="latest">Latest</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            {sortedPosts.length > 0 ? (
              sortedPosts.map(post => (
                <Card key={post.id} className={post.isPinned ? 'border-blue-200 bg-blue-50' : ''}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {post.author.profileImage ? (
                            <img
                              src={post.author.profileImage}
                              alt={post.author.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg font-medium">
                              {post.author.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium">{post.author.name}</p>
                            <span className="text-xs text-gray-500">
                              {post.author.role === 'founder' ? 'Founder' : 'Investor'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                        </div>
                      </div>

                      {post.isPinned && (
                        <div className="flex items-center text-blue-600 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <path d="m18 8-9 9-7-7 9-9 7 7zM9 4v8M4 9h8"/>
                          </svg>
                          Pinned
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <Link href={`/community/forum/${post.id}`} className="text-xl font-semibold hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                      <p className="mt-2 text-gray-700 line-clamp-2">{post.content}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {post.tags.map(tag => (
                        <span
                          key={`${post.id}-${tag}`}
                          className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600"
                          onClick={() => setActiveTag(tag)}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                        </svg>
                        {post.commentsCount} comments
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                        {post.viewsCount} views
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                        </svg>
                        {post.likesCount} likes
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-gray-500 mb-4">No posts found matching your criteria</p>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setActiveTag(null);
                    setActiveCategory('all');
                  }}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {sortedPosts.length > 0 && (
            <div className="flex justify-center">
              <Button variant="outline">
                Load More Posts
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}