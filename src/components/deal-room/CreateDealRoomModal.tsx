"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserRole } from '@/contexts/UserRoleContext';
import { useApiMutation } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Brain, 
  DollarSign, 
  Lightbulb, 
  Loader2, 
  Plus, 
  User, 
  Users 
} from 'lucide-react';
import QuickValuationWidget from '@/components/ai-analytics/QuickValuationWidget';

interface Project {
  id: string;
  title: string;
  industry?: string;
  stage?: string;
  monthlyRevenue?: number;
  userCount?: number;
  growthRate?: number;
  teamSize?: number;
}

interface Investor {
  id: string;
  name: string;
  company?: string;
  investmentPreferences?: string[];
  minInvestment?: number;
  maxInvestment?: number;
}

interface ValuationEstimate {
  min: number;
  avg: number;
  max: number;
  confidence: number;
  currency: string;
}

interface CreateDealRoomModalProps {
  projects?: Project[];
  investors?: Investor[];
  trigger?: React.ReactNode;
}

export default function CreateDealRoomModal({
  projects = [],
  investors = [],
  trigger
}: CreateDealRoomModalProps) {
  const router = useRouter();
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    projectId: '',
    projectName: '',
    industry: '',
    stage: '',
    monthlyRevenue: '',
    userCount: '',
    growthRate: '',
    teamSize: '',
    investorId: '',
    investorName: '',
    investmentFocus: '',
    investorExperience: '',
    initialTerms: {
      investmentAmount: '',
      equity: '',
      notes: ''
    }
  });
  const [valuation, setValuation] = useState<ValuationEstimate | null>(null);
  
  // Using test user IDs for demo purposes
  // In a real app, this would come from authentication
  const userId = role === 'founder' ? 'founder-1' : 'investor-1';
  const userName = role === 'founder' ? 'John Founder' : 'Jane Investor';
  
  // Create deal room mutation
  const createDealRoomMutation = useApiMutation(
    'post',
    '/api/deal-rooms',
    {
      invalidateQueries: [['deal-rooms']],
      onSuccess: (data: any) => {
        setOpen(false);
        router.push(`/deal-rooms/${data.id}`);
      }
    }
  );
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (role === 'founder' && (!formData.projectId || !formData.investorId)) {
      alert('Please select a project and investor');
      return;
    }
    
    if (role === 'investor' && (!formData.projectId)) {
      alert('Please select a project');
      return;
    }
    
    // Set up request data
    const requestData = {
      projectId: formData.projectId || projects[0]?.id || 'project-1',
      projectName: formData.projectName || projects.find(p => p.id === formData.projectId)?.title || 'Sample Project',
      founderUserId: role === 'founder' ? userId : 'founder-1',
      founderName: role === 'founder' ? userName : 'John Founder',
      investorUserId: role === 'investor' ? userId : formData.investorId || 'investor-1',
      investorName: role === 'investor' ? userName : formData.investorName || investors.find(i => i.id === formData.investorId)?.name || 'Jane Investor',
      initialTerms: {
        investmentAmount: formData.initialTerms.investmentAmount ? parseInt(formData.initialTerms.investmentAmount) : undefined,
        equity: formData.initialTerms.equity ? parseFloat(formData.initialTerms.equity) : undefined,
        notes: formData.initialTerms.notes || undefined
      }
    };
    
    // Create deal room
    createDealRoomMutation.mutate(requestData);
  };
  
  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('initialTerms.')) {
      const termField = name.split('.')[1];
      setFormData({
        ...formData,
        initialTerms: {
          ...formData.initialTerms,
          [termField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
      
      // If selecting a project or investor, also set the name
      if (name === 'projectId') {
        const project = projects.find(p => p.id === value);
        if (project) {
          setFormData(prev => ({
            ...prev,
            projectId: value,
            projectName: project.title
          }));
        }
      } else if (name === 'investorId') {
        const investor = investors.find(i => i.id === value);
        if (investor) {
          setFormData(prev => ({
            ...prev,
            investorId: value,
            investorName: investor.name
          }));
        }
      }
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Deal Room
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Deal Room</DialogTitle>
          <DialogDescription>
            Start a secure deal discussion space where you can negotiate terms and share documents.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {role === 'founder' ? (
            <>
              {/* For founders, select project and investor */}
              <div className="space-y-2">
                <Label htmlFor="projectId">Select Your Project</Label>
                <select
                  id="projectId"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select a project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                  {/* Demo option if no projects are available */}
                  {projects.length === 0 && (
                    <option value="project-1">Sample Project</option>
                  )}
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investorId">Select Investor</Label>
                <select
                  id="investorId"
                  name="investorId"
                  value={formData.investorId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select an investor</option>
                  {investors.map(investor => (
                    <option key={investor.id} value={investor.id}>
                      {investor.name} {investor.company ? `(${investor.company})` : ''}
                    </option>
                  ))}
                  {/* Demo options if no investors are available */}
                  {investors.length === 0 && (
                    <>
                      <option value="investor-1">Jane Investor (VC Capital)</option>
                      <option value="investor-2">Robert Angel (Angel Investments)</option>
                    </>
                  )}
                </select>
              </div>
            </>
          ) : (
            // For investors, select project
            <div className="space-y-2">
              <Label htmlFor="projectId">Select Project</Label>
              <select
                id="projectId"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              >
                <option value="">Select a project</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
                {/* Demo option if no projects are available */}
                {projects.length === 0 && (
                  <>
                    <option value="project-1">TechStartup X</option>
                    <option value="project-2">EcoSolutions</option>
                  </>
                )}
              </select>
            </div>
          )}
          
          {/* Project/Startup Details */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <Lightbulb className="h-4 w-4 mr-1.5 text-amber-500" />
              Startup Details
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <select
                  id="industry"
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select industry</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Healthtech">Healthtech</option>
                  <option value="Edtech">Edtech</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="CleanTech">CleanTech</option>
                  <option value="SaaS">SaaS</option>
                  <option value="Mobile Apps">Mobile Apps</option>
                  <option value="AgriTech">AgriTech</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stage">Stage</Label>
                <select
                  id="stage"
                  name="stage"
                  value={formData.stage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select stage</option>
                  <option value="Pre-seed">Pre-seed</option>
                  <option value="Seed">Seed</option>
                  <option value="Series A">Series A</option>
                  <option value="Series B">Series B</option>
                  <option value="Growth">Growth</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="monthlyRevenue">Monthly Revenue (₦)</Label>
                <Input
                  id="monthlyRevenue"
                  name="monthlyRevenue"
                  type="number"
                  value={formData.monthlyRevenue}
                  onChange={handleChange}
                  placeholder="e.g., 500000"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="userCount">User Count</Label>
                <Input
                  id="userCount"
                  name="userCount"
                  type="number"
                  value={formData.userCount}
                  onChange={handleChange}
                  placeholder="e.g., 1000"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
                <Input
                  id="growthRate"
                  name="growthRate"
                  type="number"
                  step="0.1"
                  value={formData.growthRate}
                  onChange={handleChange}
                  placeholder="e.g., 15"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  name="teamSize"
                  type="number"
                  value={formData.teamSize}
                  onChange={handleChange}
                  placeholder="e.g., 5"
                />
              </div>
            </div>
            
            {/* AI Valuation Widget */}
            {formData.industry && formData.stage && (
              <div className="mt-4">
                <QuickValuationWidget
                  projectId={formData.projectId}
                  projectName={formData.projectName}
                  industry={formData.industry}
                  stage={formData.stage}
                  monthlyRevenue={formData.monthlyRevenue ? parseInt(formData.monthlyRevenue) : undefined}
                  userCount={formData.userCount ? parseInt(formData.userCount) : undefined}
                  growthRate={formData.growthRate ? parseFloat(formData.growthRate) : undefined}
                  teamSize={formData.teamSize ? parseInt(formData.teamSize) : undefined}
                  onValuationCalculated={setValuation}
                />
              </div>
            )}
          </div>
          
          {/* Initial Deal Terms */}
          <div className="pt-4 border-t">
            <h3 className="text-sm font-medium mb-2 flex items-center">
              <DollarSign className="h-4 w-4 mr-1.5 text-green-600" />
              Initial Deal Terms {valuation && "(Based on AI Valuation)"}
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="investmentAmount">Investment Amount (₦)</Label>
                <Input
                  id="investmentAmount"
                  name="initialTerms.investmentAmount"
                  type="number"
                  value={formData.initialTerms.investmentAmount}
                  onChange={handleChange}
                  placeholder={valuation ? `${valuation.avg * 0.2}` : "e.g., 5000000"}
                />
                {valuation && (
                  <p className="text-xs text-gray-500">Suggested: ₦{(valuation.avg * 0.2).toLocaleString()}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="equity">Equity Percentage (%)</Label>
                <Input
                  id="equity"
                  name="initialTerms.equity"
                  type="number"
                  step="0.01"
                  value={formData.initialTerms.equity}
                  onChange={handleChange}
                  placeholder={valuation && formData.initialTerms.investmentAmount ? 
                    `${(parseInt(formData.initialTerms.investmentAmount) / valuation.avg * 100).toFixed(2)}` : 
                    "e.g., 10"}
                />
                {valuation && formData.initialTerms.investmentAmount && (
                  <p className="text-xs text-gray-500">
                    Suggested: {(parseInt(formData.initialTerms.investmentAmount) / valuation.avg * 100).toFixed(2)}%
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label htmlFor="notes">Additional Terms & Notes</Label>
              <Textarea
                id="notes"
                name="initialTerms.notes"
                value={formData.initialTerms.notes}
                onChange={handleChange}
                placeholder="Any additional terms or notes about the investment"
                rows={3}
              />
            </div>
          </div>
          
          {/* Investor Details Section */}
          {role === 'investor' && (
            <div className="pt-4 border-t">
              <h3 className="text-sm font-medium mb-2 flex items-center">
                <User className="h-4 w-4 mr-1.5 text-blue-600" />
                Investor Details
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="investmentFocus">Investment Focus</Label>
                <select
                  id="investmentFocus"
                  name="investmentFocus"
                  value={formData.investmentFocus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">Select focus area</option>
                  <option value="Early Stage">Early Stage</option>
                  <option value="Growth">Growth</option>
                  <option value="Revenue Focus">Revenue Focus</option>
                  <option value="Technology Focus">Technology Focus</option>
                  <option value="Social Impact">Social Impact</option>
                </select>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="investorExperience">Industry Experience</Label>
                <Textarea
                  id="investorExperience"
                  name="investorExperience"
                  value={formData.investorExperience}
                  onChange={handleChange}
                  placeholder="Share your relevant industry experience that might benefit this startup"
                  rows={2}
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={createDealRoomMutation.isPending}
            >
              {createDealRoomMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Users className="h-4 w-4 mr-2" />
                  Create Deal Room
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}