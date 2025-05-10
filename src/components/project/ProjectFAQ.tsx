'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface ProjectFAQProps {
  faqs: FAQ[];
  isFounder: boolean;
  onAddFAQ: (question: string, answer: string) => void;
  onUpdateFAQ: (id: string, question: string, answer: string) => void;
  onDeleteFAQ: (id: string) => void;
}

export default function ProjectFAQ({ 
  faqs, 
  isFounder,
  onAddFAQ,
  onUpdateFAQ,
  onDeleteFAQ 
}: ProjectFAQProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const handleAddFAQ = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    
    onAddFAQ(newQuestion, newAnswer);
    setNewQuestion('');
    setNewAnswer('');
    setIsAdding(false);
  };

  const handleUpdateFAQ = (id: string) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    
    onUpdateFAQ(id, editQuestion, editAnswer);
    setIsEditing(null);
  };

  const startEditingFAQ = (faq: FAQ) => {
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    setIsEditing(faq.id);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Frequently Asked Questions</h3>
          {isFounder && !isAdding && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAdding(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              Add FAQ
            </Button>
          )}
        </div>
        
        {/* Add new FAQ form */}
        {isAdding && (
          <div className="mb-8 p-4 border rounded-md">
            <h4 className="font-medium mb-4">Add New FAQ</h4>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-question" className="block text-sm font-medium text-gray-700 mb-1">
                  Question
                </label>
                <Input
                  id="new-question"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g., What problem does your product solve?"
                />
              </div>
              
              <div>
                <label htmlFor="new-answer" className="block text-sm font-medium text-gray-700 mb-1">
                  Answer
                </label>
                <Textarea
                  id="new-answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Provide a detailed answer..."
                  className="h-24"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAdding(false);
                    setNewQuestion('');
                    setNewAnswer('');
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddFAQ} disabled={!newQuestion.trim() || !newAnswer.trim()}>
                  Save FAQ
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* FAQ list */}
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No FAQs available yet.</p>
            {isFounder && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAdding(true)}
              >
                Add Your First FAQ
              </Button>
            )}
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                {isEditing === faq.id ? (
                  <div className="p-4 border rounded-md mb-4">
                    <h4 className="font-medium mb-4">Edit FAQ</h4>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-question" className="block text-sm font-medium text-gray-700 mb-1">
                          Question
                        </label>
                        <Input
                          id="edit-question"
                          value={editQuestion}
                          onChange={(e) => setEditQuestion(e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-answer" className="block text-sm font-medium text-gray-700 mb-1">
                          Answer
                        </label>
                        <Textarea
                          id="edit-answer"
                          value={editAnswer}
                          onChange={(e) => setEditAnswer(e.target.value)}
                          className="h-24"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsEditing(null)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={() => handleUpdateFAQ(faq.id)} 
                          disabled={!editQuestion.trim() || !editAnswer.trim()}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="text-left font-medium">{faq.question}</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2 pb-4">
                        <div className="text-gray-700 whitespace-pre-line">{faq.answer}</div>
                        
                        {isFounder && (
                          <div className="flex mt-4 justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => startEditingFAQ(faq)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                              </svg>
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => onDeleteFAQ(faq.id)}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                <line x1="10" y1="11" x2="10" y2="17"></line>
                                <line x1="14" y1="11" x2="14" y2="17"></line>
                              </svg>
                              Delete
                            </Button>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </>
                )}
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
