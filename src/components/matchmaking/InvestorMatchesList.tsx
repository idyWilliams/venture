"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatchResult, InvestorProfile } from '@/src/lib/services/matchmakingService';

interface InvestorMatchesListProps {
  matches: MatchResult[];
  investors: InvestorProfile[];
  onContact?: (investorId: string) => void;
}

export default function InvestorMatchesList({
  matches,
  investors,
  onContact
}: InvestorMatchesListProps) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);

  // Get investor details for each match
  const matchesWithInvestors = matches.map(match => {
    const investor = investors.find(i => i.id === match.investorId);
    return { ...match, investor };
  });

  const toggleExpand = (id: string) => {
    if (expandedMatch === id) {
      setExpandedMatch(null);
    } else {
      setExpandedMatch(id);
    }
  };

  // Function to get color classes based on recommendation strength
  const getStrengthColor = (strength: 'strong' | 'medium' | 'weak') => {
    switch (strength) {
      case 'strong':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-700',
          progress: 'bg-green-500'
        };
      case 'medium':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-700',
          progress: 'bg-blue-500'
        };
      case 'weak':
        return {
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          text: 'text-gray-700',
          progress: 'bg-gray-500'
        };
    }
  };

  return (
    <div className="space-y-6">
      {matchesWithInvestors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No investor matches found.</p>
        </div>
      ) : (
        matchesWithInvestors.map(match => {
          const colorClasses = getStrengthColor(match.recommendationStrength);
          return (
            <Card
              key={match.investorId}
              className={`${colorClasses.bg} ${colorClasses.border} border overflow-hidden transition-all duration-200`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {match.investor?.name || 'Unknown Investor'}
                      <span className={`text-sm px-2 py-0.5 rounded-full ${colorClasses.text} bg-white`}>
                        {match.recommendationStrength === 'strong' ? 'Strong Match' :
                         match.recommendationStrength === 'medium' ? 'Good Match' :
                         'Potential Match'}
                      </span>
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {match.investor?.preferredSectors.join(', ')}
                    </CardDescription>
                  </div>
                  <div className="text-2xl font-bold flex items-center gap-2">
                    {match.score}%
                    <div className="w-16 h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${colorClasses.progress}`}
                        style={{ width: `${match.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {match.investor?.interests.slice(0, 4).map((interest, i) => (
                    <span key={i} className="bg-white text-gray-700 text-xs px-2 py-1 rounded">
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Funding Models:</span>
                    <span className="font-medium">{match.investor?.fundingModels.join(', ')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Ticket Size:</span>
                    <span className="font-medium">
                      ${match.investor?.ticketSizeMin.toLocaleString()} - ${match.investor?.ticketSizeMax.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">ESG Focus:</span>
                    <span className="font-medium">{match.investor?.esgFocus ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                {expandedMatch === match.investorId && (
                  <div className="mt-4 bg-white p-4 rounded-lg border-gray-100 border">
                    <h4 className="font-medium mb-2">Match Details</h4>
                    <p className="text-gray-700 text-sm mb-3">{match.explanation}</p>

                    <h4 className="font-medium mb-2">Match Reasons</h4>
                    <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                      {match.reasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between border-t border-gray-100 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleExpand(match.investorId)}
                >
                  {expandedMatch === match.investorId ? 'Hide Details' : 'Show Details'}
                </Button>

                {onContact && (
                  <Button
                    size="sm"
                    onClick={() => onContact(match.investorId)}
                  >
                    Request Introduction
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })
      )}
    </div>
  );
}