"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/src/components/ui/tabs';
import InvestorMatchesList from '@/src/components/matchmaking/InvestorMatchesList';
import { MatchResult, InvestorProfile, StartupProfile } from '@/src/lib/services/matchmakingService';

export default function MatchmakingPage() {
  const [activeTab, setActiveTab] = useState('investor-matching');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  const [matches, setMatches] = useState<MatchResult[]>([
    {
      score: 87,
      investorId: "inv-1",
      startupId: "startup-1",
      recommendationStrength: "strong",
      reasons: [
        "Investor specializes in the HealthTech sector",
        "Funding amount matches investor's ticket size range",
        "Investor's previous investments include similar startups",
        "Investor has expressed interest in AI-driven healthcare solutions"
      ],
      explanation: "This investor has a strong track record in the healthcare technology space, with previous investments in similar startups. Their focus on AI-driven solutions and ticket size aligns perfectly with your funding needs."
    },
    {
      score: 72,
      investorId: "inv-2",
      startupId: "startup-1",
      recommendationStrength: "medium",
      reasons: [
        "Investor focuses on Seed stage companies",
        "Investor supports equity funding model",
        "Partial overlap with preferred technologies",
        "Geographic focus includes your region"
      ],
      explanation: "While this investor does not specialize exclusively in your sector, they have made investments in adjacent areas and their investment criteria align with your stage and funding model."
    },
    {
      score: 91,
      investorId: "inv-3",
      startupId: "startup-1",
      recommendationStrength: "strong",
      reasons: [
        "Investor specializes in the HealthTech sector",
        "Perfect alignment with investment thesis around telehealth solutions",
        "Funding amount matches investor's ticket size range",
        "Startup's high ESG impact aligns with investor's focus on impact investments",
        "Strong interest in rural healthcare technology solutions"
      ],
      explanation: "This investor is specifically looking for telehealth solutions with high social impact, making your startup an exceptional match for their portfolio. Their domain expertise and connections in the healthcare industry could provide significant value beyond capital."
    },
    {
      score: 63,
      investorId: "inv-4",
      startupId: "startup-1",
      recommendationStrength: "medium",
      reasons: [
        "Investor focuses on Seed stage companies",
        "Some interest in healthcare, though not primary focus",
        "Ticket size matches your requirements",
        "Some concern about geographic focus"
      ],
      explanation: "This investor occasionally invests outside their core focus areas when they see strong potential. While healthcare is not their primary sector, your business model and traction metrics are likely to appeal to them."
    },
    {
      score: 45,
      investorId: "inv-5",
      startupId: "startup-1",
      recommendationStrength: "weak",
      reasons: [
        "Limited experience with healthcare investments",
        "Funding amount at the upper end of their typical range",
        "Some interest in AI technologies broadly",
        "Not typically focused on impact-driven startups"
      ],
      explanation: "This investor has limited experience in your sector and your funding needs are at the upper end of their typical range. However, their interest in AI technologies might make your startup of peripheral interest to them."
    }
  ]);

  const [investors, setInvestors] = useState<InvestorProfile[]>([
    {
      id: "inv-1",
      name: "Healthtech Capital Partners",
      interests: ["Telehealth", "Biotech", "Health Analytics", "AI in Healthcare"],
      previousInvestments: ["MedConnect", "BioInnovate", "HealthAI"],
      investmentStages: ["Seed", "Series A"],
      preferredSectors: ["HealthTech", "BioTech"],
      preferredLocations: ["San Francisco", "Boston", "New York"],
      ticketSizeMin: 500000,
      ticketSizeMax: 2000000,
      fundingModels: ["equity"],
      esgFocus: false
    },
    {
      id: "inv-2",
      name: "Tech Ventures Fund",
      interests: ["SaaS", "AI", "Machine Learning", "Enterprise Software"],
      previousInvestments: ["CloudTech", "AIvision", "DataMatrix"],
      investmentStages: ["Seed", "Series A"],
      preferredSectors: ["SaaS", "AI", "Enterprise Software"],
      preferredLocations: ["San Francisco", "New York", "Austin"],
      ticketSizeMin: 250000,
      ticketSizeMax: 1500000,
      fundingModels: ["equity"],
      esgFocus: false
    },
    {
      id: "inv-3",
      name: "Impact Health Ventures",
      interests: ["Rural Healthcare", "Telehealth", "Health Equity", "Preventative Care"],
      previousInvestments: ["CommunityMed", "AccessHealth", "PreventCare"],
      investmentStages: ["Seed"],
      preferredSectors: ["HealthTech", "Impact"],
      preferredLocations: ["Boston", "Chicago", "Remote"],
      ticketSizeMin: 300000,
      ticketSizeMax: 1500000,
      fundingModels: ["equity", "impact"],
      esgFocus: true
    },
    {
      id: "inv-4",
      name: "Generalist Capital",
      interests: ["B2B Software", "Marketplaces", "FinTech", "Consumer Apps"],
      previousInvestments: ["B2Bmarket", "FinanceApp", "ConsumerTech"],
      investmentStages: ["Seed", "Pre-seed"],
      preferredSectors: ["B2B", "FinTech", "Consumer"],
      preferredLocations: ["San Francisco", "Los Angeles", "Seattle"],
      ticketSizeMin: 200000,
      ticketSizeMax: 1000000,
      fundingModels: ["equity"],
      esgFocus: false
    },
    {
      id: "inv-5",
      name: "Tech Angels Group",
      interests: ["Mobile Apps", "Consumer Tech", "AI", "Automation"],
      previousInvestments: ["MobileFirst", "ConsumerAI", "AutomateHQ"],
      investmentStages: ["Pre-seed", "Seed"],
      preferredSectors: ["Consumer Tech", "Mobile"],
      preferredLocations: ["New York", "Miami", "Remote"],
      ticketSizeMin: 100000,
      ticketSizeMax: 500000,
      fundingModels: ["equity", "convertible note"],
      esgFocus: false
    }
  ]);

  const [startupProfile, setStartupProfile] = useState<StartupProfile>({
    id: "startup-1",
    name: "MediConnect Health Platform",
    description: "AI-powered telehealth solution connecting patients in rural areas with specialists. Using machine learning to improve diagnosis accuracy and patient outcomes.",
    sector: "HealthTech",
    stage: "Seed",
    location: "Boston, MA",
    fundingAmount: 750000,
    fundingType: "equity",
    traction: {
      users: 5000,
      revenue: 25000,
      growth: 15
    },
    team: {
      size: 8,
      experience: "Founded by medical doctors and AI researchers"
    },
    esgImpact: "high",
    tags: ["Telehealth", "AI", "Rural Healthcare", "Medical Technology"]
  });

  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleContactRequest = (investorId: string) => {
    console.log(`Contact requested for investor: ${investorId}`);
    // In a real app, this would open a dialog or navigate to a contact request form
    alert(`Contact request feature would open for investor ${investorId}`);
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold mb-4">
              AI-Driven Matchmaking
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Our sophisticated AI algorithms analyze investor preferences, startup stage, sector, and traction to recommend the best-fit opportunities for both sides.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-white text-blue-600 hover:bg-blue-50">
                Update Project Profile
              </Button>
              <Button variant="outline" className="bg-transparent border-white text-white hover:bg-blue-700">
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs
          defaultValue="investor-matching"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-8">
            <TabsTrigger value="investor-matching">
              Investor Matching
            </TabsTrigger>
            <TabsTrigger value="diverse-funding">
              Diverse Funding Models
            </TabsTrigger>
            <TabsTrigger value="personalized">
              Personalized Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="investor-matching" className="space-y-8">
            <div className="bg-white rounded-xl p-6 shadow mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Project Profile</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Project Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium">{startupProfile.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Sector:</span>
                      <span className="font-medium">{startupProfile.sector}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Stage:</span>
                      <span className="font-medium">{startupProfile.stage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Location:</span>
                      <span className="font-medium">{startupProfile.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Funding Needed:</span>
                      <span className="font-medium">${startupProfile.fundingAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Funding Type:</span>
                      <span className="font-medium capitalize">{startupProfile.fundingType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Traction & Team</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Users:</span>
                      <span className="font-medium">{startupProfile.traction.users.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Revenue:</span>
                      <span className="font-medium">${startupProfile.traction.revenue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Monthly Growth:</span>
                      <span className="font-medium">{startupProfile.traction.growth}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Team Size:</span>
                      <span className="font-medium">{startupProfile.team.size} people</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Experience:</span>
                      <span className="font-medium">{startupProfile.team.experience}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">ESG Impact:</span>
                      <span className="font-medium capitalize">{startupProfile.esgImpact || 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{startupProfile.description}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">AI-Recommended Investors</h2>
                <Button variant="outline" size="sm">
                  Refresh Recommendations
                </Button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white rounded-xl p-6 shadow animate-pulse h-40"></div>
                  ))}
                </div>
              ) : (
                <InvestorMatchesList
                  matches={matches}
                  investors={investors}
                  onContact={handleContactRequest}
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="diverse-funding">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Diverse Funding Models</h2>
                <p className="text-gray-600 mb-6">
                  VentureHive Pro supports multiple funding models to match your startup's unique needs and growth trajectory.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: "Equity Investment",
                      description: "Traditional venture capital funding in exchange for equity in your company.",
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ),
                      color: "bg-blue-50",
                      buttonText: "Find Equity Investors"
                    },
                    {
                      title: "Revenue-Based Financing",
                      description: "Non-dilutive capital with flexible repayment based on your monthly revenue.",
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      ),
                      color: "bg-purple-50",
                      buttonText: "Explore RBF Options"
                    },
                    {
                      title: "Corporate Venture Capital",
                      description: "Strategic investment from corporations offering resources beyond just funding.",
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      ),
                      color: "bg-orange-50",
                      buttonText: "Find Corporate Partners"
                    },
                    {
                      title: "Impact Investing",
                      description: "Funding for startups with strong social or environmental missions and measurable impact.",
                      icon: (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      color: "bg-green-50",
                      buttonText: "Explore Impact Options"
                    },
                  ].map((model, index) => (
                    <div key={index} className={`${model.color} rounded-xl p-6 border border-gray-100`}>
                      <div className="mb-4">
                        {model.icon}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{model.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{model.description}</p>
                      <Button variant="outline" size="sm" className="w-full">
                        {model.buttonText}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <h3 className="font-semibold mb-4">Not sure which funding model is right for you?</h3>
                <Button>
                  Take Funding Model Assessment
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="personalized">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Personalized Recommendations</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">AI-Generated Insights</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-700 mb-2">Investment Readiness</h4>
                      <p className="text-gray-700 text-sm">
                        Based on your traction metrics and team experience, your startup shows strong investment readiness for seed-stage funding.
                      </p>
                    </div>

                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                      <h4 className="font-medium text-green-700 mb-2">Funding Model Fit</h4>
                      <p className="text-gray-700 text-sm">
                        Given your focus on healthcare impact in rural areas, consider exploring impact investors alongside traditional equity funding.
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <h4 className="font-medium text-purple-700 mb-2">Pitch Enhancement</h4>
                      <p className="text-gray-700 text-sm">
                        Emphasize your machine learning technology's ability to improve diagnosis accuracy, as this is highly attractive to your top investor matches.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Recommended Next Steps</h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Complete Your Investor Profile",
                        description: "Add more details about your ideal investor to improve matching precision.",
                        status: "completed"
                      },
                      {
                        title: "Prepare Investor-Ready Documents",
                        description: "Upload your pitch deck, financial projections, and team bios.",
                        status: "in-progress"
                      },
                      {
                        title: "Engage With Top Matches",
                        description: "Reach out to your highest-scoring investor matches.",
                        status: "pending"
                      },
                      {
                        title: "Schedule Expert Review",
                        description: "Get feedback on your pitch materials from our network of experts.",
                        status: "pending"
                      },
                    ].map((step, index) => (
                      <li key={index} className="flex items-start">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                          step.status === 'completed' ? 'bg-green-100 text-green-600' :
                          step.status === 'in-progress' ? 'bg-blue-100 text-blue-600' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {step.status === 'completed' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : step.status === 'in-progress' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{step.title}</h4>
                          <p className="text-sm text-gray-600">{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-6">
                    <Button>Continue Onboarding</Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}