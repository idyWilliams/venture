'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Textarea } from '@/src/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  //@ts-ignore,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/src/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { analyzeEngagementPotential } from '@/src/lib/openai';

// Define form schema with Zod
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }).max(100),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(300),
  pitch: z.string().min(50, { message: "Pitch must be at least 50 characters" }),
  industry: z.string().min(1, { message: "Please select an industry" }),
  fundingStage: z.string().min(1, { message: "Please select a funding stage" }),
  fundingAmount: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  equity: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
  demo: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal('')),
});

const industries = [
  "AI / Machine Learning",
  "Biotech",
  "Clean Energy",
  "Consumer",
  "Cryptocurrency / Blockchain",
  "E-commerce",
  "Education",
  "Enterprise Software",
  "FinTech",
  "FoodTech",
  "Gaming",
  "Healthcare",
  "Hardware",
  "IoT",
  "Manufacturing",
  "Marketplace",
  "Media",
  "Mobile",
  "Real Estate",
  "Retail",
  "SaaS",
  "Security",
  "Supply Chain",
  "Transportation"
];

const fundingStages = [
  "Pre-seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C",
  "Series D+"
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [engagementAnalysis, setEngagementAnalysis] = useState<{
    score: number;
    feedback: string;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    //@ts-ignore
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      pitch: '',
      industry: '',
      fundingStage: '',
      fundingAmount: 0,
      equity: 0,
      website: '',
      demo: '',
    },
  });

  // Watch pitch value for analysis
  const pitch = form.watch('pitch');

  const analyzePitch = async () => {
    if (pitch.length < 50) return;

    setIsAnalyzing(true);
    try {
      // In a real app, this would be an API call
      // const response = await fetch('/api/analyze-pitch', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ pitch }),
      // });
      // const data = await response.json();

      // For demo, we'll use a client-side function that would normally be on the server
      const data = await analyzeEngagementPotential(pitch);

      setEngagementAnalysis(data);
    } catch (error) {
      console.error('Failed to analyze pitch:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to create the project
      // const response = await fetch('/api/projects', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values),
      // });

      // const data = await response.json();

      // Mock successful response
      console.log('Project data:', values);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect to the new project page
      router.push('/dashboard/founder');
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <p className="text-gray-600 mt-1">Share your startup with potential investors</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill out the information below to create your project listing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              {/* @ts-ignore */}
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                //@ts-ignore
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., AI-Powered Healthcare Assistant" {...field} />
                      </FormControl>
                      <FormDescription>
                        A clear, concise name for your startup or project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                //@ts-ignore
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of your project (max 300 characters)"
                          className="h-20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A one or two sentence summary of your project
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                //@ts-ignore
                  control={form.control}
                  name="pitch"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Detailed Pitch</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Provide a detailed description of your project, the problem it solves, your target market, and competitive advantage."
                          className="h-40 resize-none"
                          {...field}
                          onBlur={() => {
                            field.onBlur();
                            if (field.value.length >= 50) {
                              analyzePitch();
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Your comprehensive project pitch (will be analyzed for engagement potential)
                      </FormDescription>
                      <FormMessage />

                      {engagementAnalysis && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md border">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">Engagement Score:</span>
                            <span className={`text-sm font-semibold ${
                              engagementAnalysis.score >= 80 ? 'text-green-600' :
                              engagementAnalysis.score >= 60 ? 'text-blue-600' :
                              engagementAnalysis.score >= 40 ? 'text-yellow-600' :
                              'text-red-600'
                            }`}>
                              {engagementAnalysis.score}/100
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                            <div
                              className={`h-2 rounded-full ${
                                engagementAnalysis.score >= 80 ? 'bg-green-600' :
                                engagementAnalysis.score >= 60 ? 'bg-blue-600' :
                                engagementAnalysis.score >= 40 ? 'bg-yellow-600' :
                                'bg-red-600'
                              }`}
                              style={{ width: `${engagementAnalysis.score}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-600">{engagementAnalysis.feedback}</p>
                        </div>
                      )}

                      {isAnalyzing && (
                        <div className="flex items-center mt-2 text-sm text-gray-500">
                          <div className="animate-spin h-4 w-4 border-2 border-blue-600 rounded-full border-t-transparent mr-2"></div>
                          Analyzing pitch for engagement potential...
                        </div>
                      )}
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                  //@ts-ignore
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                  //@ts-ignore
                    control={form.control}
                    name="fundingStage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Stage</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select funding stage" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fundingStages.map((stage) => (
                              <SelectItem key={stage} value={stage}>
                                {stage}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                  //@ts-ignore
                    control={form.control}
                    name="fundingAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Funding Amount ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 500000"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          How much funding are you seeking?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                  //@ts-ignore
                    control={form.control}
                    name="equity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Equity Offered (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 10"
                            min="0"
                            max="100"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          What percentage of equity are you offering?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                //@ts-ignore
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                //@ts-ignore
                  control={form.control}
                  name="demo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Demo URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://demo.yourwebsite.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isSubmitting ? 'Creating Project...' : 'Create Project'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
