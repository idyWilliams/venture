"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Brain, Loader2, RefreshCw } from 'lucide-react';

interface ValuationEstimate {
  min: number;
  avg: number;
  max: number;
  confidence: number;
  currency: string;
}

interface QuickValuationWidgetProps {
  projectId?: string;
  projectName?: string;
  industry?: string;
  stage?: string;
  monthlyRevenue?: number;
  userCount?: number;
  growthRate?: number;
  teamSize?: number;
  onValuationCalculated?: (valuation: ValuationEstimate) => void;
}

export default function QuickValuationWidget({
  projectId,
  projectName,
  industry,
  stage,
  monthlyRevenue,
  userCount,
  growthRate,
  teamSize,
  onValuationCalculated
}: QuickValuationWidgetProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [valuation, setValuation] = useState<ValuationEstimate | null>(null);

  // Calculate valuation when project details change or on demand
  const calculateValuation = async () => {
    if (!projectName && !projectId) {
      setError("Project information is required");
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // In a real implementation, this would call the OpenAI API
      // const response = await fetch('/api/valuation/calculate', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     projectId,
      //     projectName,
      //     industry,
      //     stage,
      //     monthlyRevenue,
      //     userCount,
      //     growthRate,
      //     teamSize,
      //   }),
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll use a simple model with some randomness
      // In the actual implementation, this would be replaced with a real API call
      
      // Base valuation factors
      const revenueMultiplier = getRevenueMultiplier(industry, stage);
      const userMultiplier = getUserMultiplier(industry);
      
      // Calculate base valuation
      let baseValuation = 0;
      
      // Revenue-based component (most important factor)
      if (monthlyRevenue) {
        baseValuation += monthlyRevenue * 12 * revenueMultiplier;
      }
      
      // User-based component if early stage with little revenue
      if (userCount && (!monthlyRevenue || monthlyRevenue < 1000)) {
        baseValuation += userCount * userMultiplier;
      }
      
      // Minimum valuation based on team and idea if pre-revenue
      if (baseValuation < 50000) {
        baseValuation = teamSize ? teamSize * 150000 : 300000;
      }
      
      // Growth rate affects valuation significantly
      const growthMultiplier = growthRate ? (1 + growthRate / 100) : 1.2;
      baseValuation *= growthMultiplier;
      
      // Add some randomness for demo purposes
      const randomFactor = 0.85 + (Math.random() * 0.3); // 0.85 to 1.15
      baseValuation *= randomFactor;
      
      // Round to nearest 10000
      baseValuation = Math.round(baseValuation / 10000) * 10000;
      
      // Create range for min/max
      const valuationResult: ValuationEstimate = {
        min: Math.max(100000, Math.round(baseValuation * 0.7)),
        avg: baseValuation,
        max: Math.round(baseValuation * 1.5),
        confidence: 65 + Math.round(Math.random() * 20), // 65% to 85%
        currency: 'NGN'
      };
      
      // Simulate network delay
      setTimeout(() => {
        setValuation(valuationResult);
        setLoading(false);
        
        if (onValuationCalculated) {
          onValuationCalculated(valuationResult);
        }
      }, 1000);
      
    } catch (err) {
      setError('Failed to calculate valuation');
      setLoading(false);
      console.error('Error calculating valuation:', err);
    }
  };
  
  // Helper function to determine revenue multiplier based on industry and stage
  const getRevenueMultiplier = (industry?: string, stage?: string): number => {
    // Default values
    if (!industry) return 5;
    if (!stage) return 5;
    
    // Technology companies typically get higher multiples
    if (industry.toLowerCase().includes('tech') || 
        industry.toLowerCase().includes('ai') || 
        industry.toLowerCase().includes('software')) {
      
      if (stage.toLowerCase().includes('seed')) {
        return 8;
      } else if (stage.toLowerCase().includes('series a')) {
        return 10;
      } else {
        return 12;
      }
    }
    
    // Health and biotech typically get high multiples too
    if (industry.toLowerCase().includes('health') || 
        industry.toLowerCase().includes('bio') || 
        industry.toLowerCase().includes('med')) {
      
      if (stage.toLowerCase().includes('seed')) {
        return 7;
      } else if (stage.toLowerCase().includes('series a')) {
        return 9;
      } else {
        return 11;
      }
    }
    
    // Default for other industries
    if (stage.toLowerCase().includes('seed')) {
      return 4;
    } else if (stage.toLowerCase().includes('series a')) {
      return 6;
    } else {
      return 8;
    }
  };
  
  // Helper function to determine per-user value based on industry
  const getUserMultiplier = (industry?: string): number => {
    if (!industry) return 100;
    
    if (industry.toLowerCase().includes('saas') || 
        industry.toLowerCase().includes('software')) {
      return 500;
    } else if (industry.toLowerCase().includes('consumer') || 
               industry.toLowerCase().includes('mobile')) {
      return 100;
    } else if (industry.toLowerCase().includes('health') || 
               industry.toLowerCase().includes('finance')) {
      return 800;
    } else {
      return 200;
    }
  };
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate on component mount if we have enough data
  useEffect(() => {
    if (projectId || (projectName && industry)) {
      calculateValuation();
    }
  }, []);

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <Brain className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-md font-medium">AI Valuation Estimate</h3>
        </div>
        {!loading && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={calculateValuation} 
            className="h-8 w-8 p-0"
            title="Recalculate"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {loading ? (
        <div className="py-6 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600 mb-2" />
          <p className="text-sm text-gray-600">Calculating project valuation...</p>
        </div>
      ) : error ? (
        <div className="py-6 text-center">
          <p className="text-sm text-red-600 mb-3">{error}</p>
          <Button size="sm" onClick={calculateValuation}>Try Again</Button>
        </div>
      ) : valuation ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Average Valuation:</span>
            <span className="text-lg font-bold text-blue-700">{formatCurrency(valuation.avg)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Range:</span>
            <span className="text-sm">{formatCurrency(valuation.min)} - {formatCurrency(valuation.max)}</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${valuation.confidence}%` }}
            ></div>
          </div>
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Confidence: {valuation.confidence}%</span>
            <span className="text-xs italic">Based on available data</span>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Enter project details to calculate valuation</p>
          <Button size="sm" onClick={calculateValuation}>Calculate Now</Button>
        </div>
      )}
    </div>
  );
}