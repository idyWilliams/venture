"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    company: '',
    role: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // In a real implementation, this would be a server request
      // await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formState)
      // });

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitted(true);
      setFormState({
        name: '',
        email: '',
        company: '',
        role: '',
        subject: '',
        message: '',
      });
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('There was an error submitting your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Get in touch</span>
            <span className="block text-blue-600">We'd love to hear from you</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-xl text-gray-500">
            Have questions about VentureHive Pro? Looking for investor introductions? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact info cards */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-blue-50 border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center text-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Us
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-600">support@venturehive.com</p>
                <p className="text-sm text-gray-500 mt-2">For general inquiries and support</p>
              </CardContent>
            </Card>
            
            <Card className="bg-purple-50 border-purple-100">
              <CardHeader>
                <CardTitle className="flex items-center text-purple-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                  Sales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-600">sales@venturehive.com</p>
                <p className="text-sm text-gray-500 mt-2">For pricing and enterprise plans</p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-green-100">
              <CardHeader>
                <CardTitle className="flex items-center text-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-600">partners@venturehive.com</p>
                <p className="text-sm text-gray-500 mt-2">For accelerators and strategic partnerships</p>
              </CardContent>
            </Card>
            
            <Card className="bg-indigo-50 border-indigo-100">
              <CardHeader>
                <CardTitle className="flex items-center text-indigo-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Office
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-600">
                  VentureHive Headquarters<br />
                  123 Startup Street<br />
                  San Francisco, CA 94107
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Send us a message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="mt-3 text-lg font-medium text-gray-900">Thank you for reaching out!</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      We've received your message and will get back to you within 24 hours.
                    </p>
                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={() => setSubmitted(false)}
                      >
                        Send another message
                      </Button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          value={formState.name}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formState.email}
                          onChange={handleChange}
                          required
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          name="company"
                          type="text"
                          value={formState.company}
                          onChange={handleChange}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Your Role</Label>
                        <select
                          id="role"
                          name="role"
                          value={formState.role}
                          onChange={handleChange}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 mt-1"
                        >
                          <option value="">Select your role</option>
                          <option value="founder">Founder</option>
                          <option value="investor">Investor</option>
                          <option value="accelerator">Accelerator Manager</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        className="mt-1 min-h-[150px]"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}

                    <div className="text-right">
                      <Button
                        type="submit"
                        disabled={submitting}
                      >
                        {submitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Frequently asked questions
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Can't find the answer you're looking for? Contact our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {[
              {
                question: "How quickly can I expect a response?",
                answer: "We strive to respond to all inquiries within 24 hours during business days. For urgent matters, please mention this in your message subject.",
              },
              {
                question: "Do you offer demos of the platform?",
                answer: "Yes! You can schedule a personal demo with one of our product specialists. They'll walk you through all the features and answer any questions specific to your use case.",
              },
              {
                question: "I'm having trouble with my account. What should I do?",
                answer: "For account-related issues, please email support@venturehive.com with your username and a detailed description of the problem. Our technical team will assist you promptly.",
              },
              {
                question: "Can I request a feature that's not currently available?",
                answer: "Absolutely! We love hearing feature suggestions from our users. Please use the contact form to submit your ideas, and our product team will review them for future updates.",
              },
            ].map((faq, index) => (
              <div key={index} className="border-t border-gray-200 pt-6">
                <dt className="text-lg font-medium text-gray-900">{faq.question}</dt>
                <dd className="mt-2 text-base text-gray-500">{faq.answer}</dd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}