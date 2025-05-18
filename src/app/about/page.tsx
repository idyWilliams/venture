"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Williams Idorenyin",
      role: "Co-Founder & CEO",
      bio: "Former VC partner with 10+ years of experience connecting startups with investors. Led investments in 30+ companies with 5 exits.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
      name: "Williams Idorenyin",
      role: "Co-Founder & CTO",
      bio: "Serial entrepreneur with two successful exits. Built machine learning systems for financial markets and investment analytics.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
      name: "Williams Idorenyin",
      role: "Chief Product Officer",
      bio: "Previously led product at a Y Combinator startup acquired for $150M. Expert in user experience design and product development.",
      image:
        "https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
      name: "Williams Idorenyin",
      role: "VP of Engineering",
      bio: "Full-stack developer with 15 years of experience building enterprise SaaS platforms. Led engineering teams at Microsoft and Shopify.",
      image:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
      name: "Williams Idorenyin",
      role: "Head of Customer Success",
      bio: "Passionate about helping founders succeed. Previously led startup accelerator programs in Silicon Valley and New York.",
      image:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
    {
      name: "Williams Idorenyin",
      role: "Head of AI & Data Science",
      bio: "PhD in Machine Learning from Stanford. Developed AI systems for investment analysis and market prediction at Goldman Sachs.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&h=600&q=80",
    },
  ];

  const investorBackers = [
    {
      name: "Accel Ventures",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=Accel+Ventures&font=opensans",
    },
    {
      name: "Sequoia Capital",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=Sequoia+Capital&font=opensans",
    },
    {
      name: "Y Combinator",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=Y+Combinator&font=opensans",
    },
    {
      name: "Founders Fund",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=Founders+Fund&font=opensans",
    },
    {
      name: "Andreessen Horowitz",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=a16z&font=opensans",
    },
    {
      name: "SV Angel",
      logo: "https://placehold.co/200x100/e2e8f0/1e40af?text=SV+Angel&font=opensans",
    },
  ];

  const timeline = [
    {
      year: "2022",
      title: "Founding",
      description: "VentureHive was founded by Emily Chen and David Rodriguez to solve the challenges they faced connecting startups with the right investors.",
    },
    {
      year: "2022",
      title: "Seed Round",
      description: "Raised $3M in seed funding from leading investors to build the initial platform focused on engagement analytics.",
    },
    {
      year: "2023",
      title: "Platform Launch",
      description: "Launched VentureHive 1.0 with basic matching and engagement tracking features, attracting 1,000+ founders in the first quarter.",
    },
    {
      year: "2023",
      title: "Series A",
      description: "Secured $12M Series A to expand the team and integrate AI capabilities for better matching and analytics.",
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Released VentureHive Pro with AI-powered pitch analysis, investor matching, and success prediction features.",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Expanded to Europe and Asia, surpassing 50,000 users and facilitating over $300M in investments through the platform.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate overflow-hidden bg-gradient-to-b from-blue-100/20">
        <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <div className="inline-flex space-x-6">
                <span className="rounded-full bg-blue-600/10 px-3 py-1 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10">
                  Our Mission
                </span>
              </div>
            </div>
            <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Connecting visionary founders with smart capital
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're building the future of startup fundraising by using AI to create meaningful connections, facilitate transparent deals, and help founders access the resources they need to succeed.
            </p>
            <div className="mt-10 flex items-center gap-x-6">
              <Link href="/auth/register">
                <Button size="lg">Join our community</Button>
              </Link>
              <Link href="/features" className="text-sm font-semibold leading-6 text-gray-900">
                Learn more <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100"
                alt="Team meeting"
                width={2432}
                height={1442}
                className="w-[76rem] rounded-md bg-gray-50 shadow-xl ring-1 ring-gray-400/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Our Values</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Building a better ecosystem for startups
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We believe in transparency, fairness, and creating value for both founders and investors. Our platform is built on these core principles.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "Transparency",
                  description: "We believe transparency is key to successful relationships. Our platform provides clear metrics, honest feedback, and open communication between all parties.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                },
                {
                  name: "Meaningful Connections",
                  description: "We don't believe in random networking. Our AI-powered system creates valuable connections based on genuine fit and alignment of interests.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                    </svg>
                  ),
                },
                {
                  name: "Data-Driven Decisions",
                  description: "We empower founders and investors with powerful analytics and AI-driven insights to make informed decisions and maximize success.",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                  ),
                },
              ].map((value) => (
                <div key={value.name} className="flex flex-col items-start">
                  <div className="rounded-md bg-blue-600 p-2 text-white">
                    {value.icon}
                  </div>
                  <dt className="mt-4 font-semibold text-gray-900">{value.name}</dt>
                  <dd className="mt-2 leading-7 text-gray-600">{value.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Timeline section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Our Journey</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              From idea to industry leader
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              The story of VentureHive Pro, from our founding to where we are today.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {timeline.map((item, index) => (
                <div key={index} className="relative pl-16">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                    {item.year.substring(2)}
                  </div>
                  <div className="border-l-4 border-blue-200 pl-6 pb-12">
                    <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                    <time className="mb-2 block text-sm text-gray-500">{item.year}</time>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Our team</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              We're a diverse team of entrepreneurs, investors, engineers, and designers united by our mission to transform how startups raise capital.
            </p>
          </div>
          <ul className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {teamMembers.map((person) => (
              <li key={person.name} className="group">
                <div className="overflow-hidden rounded-2xl bg-gray-100 transition-all duration-300 group-hover:shadow-lg">
                  <img
                    className="aspect-[3/2] w-full object-cover transition-all duration-300 group-hover:scale-105"
                    src={person.image}
                    alt=""
                  />
                </div>
                <h3 className="mt-6 text-lg font-semibold leading-8 text-gray-900">{person.name}</h3>
                <p className="text-base leading-7 text-blue-600">{person.role}</p>
                <p className="mt-2 text-sm leading-6 text-gray-600">{person.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Investor section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Our Backers</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Backed by the best
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              VentureHive Pro is supported by leading venture capital firms who believe in our mission.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-lg grid-cols-2 items-center gap-x-8 gap-y-12 sm:max-w-xl sm:grid-cols-3 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-6">
            {investorBackers.map((investor) => (
              <div key={investor.name} className="group cursor-pointer transition duration-300 hover:opacity-80">
                <img
                  className="h-12 w-auto object-contain"
                  src={investor.logo}
                  alt={investor.name}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Join us CTA */}
      <div className="bg-blue-600">
        <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:flex lg:items-center lg:justify-between lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to transform your fundraising?</span>
            <span className="block text-blue-200">Get started with VentureHive Pro today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link href="/auth/register">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                  Get Started
                </Button>
              </Link>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <Link href="/contact">
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-blue-700">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}