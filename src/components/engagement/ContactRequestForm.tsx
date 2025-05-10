'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Form schema
const formSchema = z.object({
  message: z.string()
    .min(20, { message: 'Message must be at least 20 characters' })
    .max(1000, { message: 'Message cannot exceed 1000 characters' }),
});

interface ContactRequestFormProps {
  founderName: string;
  onSubmit: (message: string) => Promise<void>;
  onCancel: () => void;
}

export default function ContactRequestForm({ 
  founderName, 
  onSubmit,
  onCancel
}: ContactRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });
  
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      await onSubmit(values.message);
    } catch (error) {
      console.error('Failed to send contact request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact Request</DialogTitle>
          <DialogDescription>
            Send a message to {founderName} to express your interest
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={`Explain why you're interested in ${founderName}'s project and what you would like to discuss`}
                      className="h-40 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button
                type="button" 
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="ml-2"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
        
        <div className="text-sm text-gray-500 mt-4">
          <p>Note: The founder must approve your request before you can exchange direct messages.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
