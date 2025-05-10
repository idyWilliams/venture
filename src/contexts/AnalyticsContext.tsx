"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for the analytics data
export interface EngagementOverview {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalContactRequests: number;
  viewsPercentChange: number;
  likesPercentChange: number;
  commentsPercentChange: number;
  contactRequestsPercentChange: number;
}

export interface TimeSeriesData {
  date: string;
  views: number;
  likes?: number;
  comments?: number;
  contactRequests?: number;
}

export interface InvestorInterest {
  name: string;
  views: number;
  contactRequests: number;
}

export interface IndustryInsight {
  industry: string;
  averageViews: number;
  userPerformance: number;
  percentile: number;
}

export interface AnalyticsState {
  engagementOverview: EngagementOverview;
  timeSeriesData: TimeSeriesData[];
  topInvestors: InvestorInterest[];
  industryInsights: IndustryInsight[];
  isLoading: boolean;
  error: string | null;
  timeframe: '7d' | '30d' | '90d' | 'all';
}

interface AnalyticsContextProps {
  analyticsState: AnalyticsState;
  setTimeframe: (timeframe: '7d' | '30d' | '90d' | 'all') => void;
  refreshData: (projectId?: string) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextProps | undefined>(undefined);

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
  projectId?: string;
  initialData?: Partial<AnalyticsState>;
}

export function AnalyticsProvider({ 
  children, 
  projectId,
  initialData = {}
}: AnalyticsProviderProps) {
  const [analyticsState, setAnalyticsState] = useState<AnalyticsState>({
    engagementOverview: {
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      totalContactRequests: 0,
      viewsPercentChange: 0,
      likesPercentChange: 0,
      commentsPercentChange: 0,
      contactRequestsPercentChange: 0,
    },
    timeSeriesData: [],
    topInvestors: [],
    industryInsights: [],
    isLoading: true,
    error: null,
    timeframe: '30d',
    ...initialData,
  });

  const fetchAnalyticsData = async (id?: string, timeframe: string = analyticsState.timeframe) => {
    if (!id && !projectId) return;
    
    setAnalyticsState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const endpoint = `/api/engagement?projectId=${id || projectId}&timeframe=${timeframe}`;
      const response = await fetch(endpoint);
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }
      
      const data = await response.json();
      
      setAnalyticsState(prev => ({
        ...prev,
        engagementOverview: data.overview,
        timeSeriesData: data.timeSeriesData,
        topInvestors: data.topInvestors,
        industryInsights: data.industryInsights,
        isLoading: false,
        error: null,
        timeframe: timeframe as '7d' | '30d' | '90d' | 'all',
      }));
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      setAnalyticsState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch analytics data',
      }));
    }
  };

  const setTimeframe = (timeframe: '7d' | '30d' | '90d' | 'all') => {
    fetchAnalyticsData(projectId, timeframe);
  };

  const refreshData = async (id?: string) => {
    await fetchAnalyticsData(id || projectId, analyticsState.timeframe);
  };

  useEffect(() => {
    if (projectId) {
      fetchAnalyticsData(projectId);
    }
  }, [projectId]);

  return (
    <AnalyticsContext.Provider value={{ analyticsState, setTimeframe, refreshData }}>
      {children}
    </AnalyticsContext.Provider>
  );
}