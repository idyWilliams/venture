"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface SuccessPredictionResult {
  successProbability: number;
  timeframe: {
    oneYear: number;
    threeYear: number;
    fiveYear: number;
  };
  keyStrengths: string[];
  keyRisks: string[];
  valuationEstimate: {
    min: number;
    avg: number;
    max: number;
  };
  suggestedFocus: string[];
}

interface ProjectSuccessAnalyticsProps {
  projectId: string;
}

export default function ProjectSuccessAnalytics({ projectId }: ProjectSuccessAnalyticsProps) {
  const [predictionData, setPredictionData] = useState<SuccessPredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPredictionData = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would call the API
      // const response = await fetch(`/api/projects/${projectId}/predict-success`);
      // const data = await response.json();

      // For demo purposes, we'll use mock data
      // In the actual implementation, this would be replaced with a real API call
      const mockPredictionData: SuccessPredictionResult = {
        successProbability: 0.72,
        timeframe: {
          oneYear: 45,
          threeYear: 68,
          fiveYear: 83
        },
        keyStrengths: [
          "Strong technical founding team",
          "Innovative solution in a growing market",
          "Early customer traction"
        ],
        keyRisks: [
          "Capital intensive business model",
          "Highly competitive market",
          "Regulatory challenges"
        ],
        valuationEstimate: {
          min: 2500000,
          avg: 4200000,
          max: 7500000
        },
        suggestedFocus: [
          "Customer acquisition strategy",
          "Strategic partnerships",
          "Regulatory compliance"
        ]
      };

      // Simulate network delay
      setTimeout(() => {
        setPredictionData(mockPredictionData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('Failed to load prediction data');
      setLoading(false);
      console.error('Error fetching prediction data:', err);
    }
  };

  useEffect(() => {
    fetchPredictionData();
  }, [projectId]);

  // Format data for timeline chart
  const timelineData = predictionData ? [
    { name: '1 Year', success: predictionData.timeframe.oneYear },
    { name: '3 Years', success: predictionData.timeframe.threeYear },
    { name: '5 Years', success: predictionData.timeframe.fiveYear }
  ] : [];

  // Format data for success probability pie chart
  const probabilityData = predictionData ? [
    { name: 'Success', value: predictionData.successProbability * 100 },
    { name: 'Failure', value: 100 - (predictionData.successProbability * 100) }
  ] : [];

  // Format data for valuation chart
  const valuationData = predictionData ? [
    { name: 'Minimum', value: predictionData.valuationEstimate.min },
    { name: 'Average', value: predictionData.valuationEstimate.avg },
    { name: 'Maximum', value: predictionData.valuationEstimate.max }
  ] : [];

  const COLORS = ['#0088FE', '#FF8042'];

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Success Analytics</CardTitle>
          <CardDescription>
            Analyzing your project's success factors...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-blue-200 mb-4"></div>
            <div className="h-4 w-32 bg-blue-200 rounded mb-2"></div>
            <div className="h-3 w-24 bg-blue-100 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Success Analytics</CardTitle>
          <CardDescription>
            Error loading analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={fetchPredictionData}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (!predictionData) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>AI Success Analytics</CardTitle>
          <CardDescription>
            No prediction data available
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={fetchPredictionData}>Generate Prediction</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Success Analytics</CardTitle>
        <CardDescription>
          AI-powered prediction of your project's success potential
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="valuation">Valuation</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Success Probability</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={probabilityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {probabilityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold">{(predictionData.successProbability * 100).toFixed(1)}%</p>
                  <p className="text-sm text-gray-500">Overall Success Probability</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Valuation Estimate</h3>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={valuationData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis tickFormatter={(value) => `₦${value / 1000000}M`} />
                      <Tooltip formatter={(value) => `₦${(value as number).toLocaleString()}`} />
                      <Bar dataKey="value" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-2">
                  <p className="text-2xl font-bold">₦{(predictionData.valuationEstimate.avg / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-500">Average Valuation Estimate</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Success Timeline</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="success" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Projected success probability over time. The longer your project exists and hits milestones, the higher the probability of long-term success.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="valuation">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Detailed Valuation Estimates</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-xl font-bold">₦{(predictionData.valuationEstimate.min / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-gray-500">Conservative Estimate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-xl font-bold">₦{(predictionData.valuationEstimate.avg / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-gray-500">Average Estimate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-xl font-bold">₦{(predictionData.valuationEstimate.max / 1000000).toFixed(2)}M</p>
                      <p className="text-sm text-gray-500">Optimistic Estimate</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <p className="text-sm text-gray-500">
                Valuation estimates are based on industry benchmarks, traction metrics, market size, and competitive analysis. These are estimations and actual valuations may vary based on negotiations and market conditions.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="insights">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Strengths</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {predictionData.keyStrengths.map((strength, index) => (
                    <li key={index} className="text-green-700">{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Key Risks</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {predictionData.keyRisks.map((risk, index) => (
                    <li key={index} className="text-red-700">{risk}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Suggested Focus Areas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {predictionData.suggestedFocus.map((focus, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="font-medium">{focus}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Analysis powered by Tensorflow.js and OpenAI. This analysis should be used as a guide only and not as a definitive prediction of future performance.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}