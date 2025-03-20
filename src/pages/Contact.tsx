
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const feedbackFormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Your feedback must be at least 10 characters.",
  }),
});

type FeedbackFormValues = z.infer<typeof feedbackFormSchema>;

const Contact = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values from the user if available
  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: user?.user_metadata?.full_name || "",
      email: user?.email || "",
      message: "",
    },
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    setIsSubmitting(true);

    try {
      // In a real app, you would send this data to your backend
      console.log("Feedback submitted:", data);
      
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Feedback received!",
        description: "Thank you for your feedback. We appreciate your input.",
      });
      
      // Redirect to home page after successful submission
      navigate("/");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "Something went wrong",
        description: "Your feedback could not be submitted. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-10 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Send Feedback</h1>
          <p className="text-muted-foreground mt-2">
            We value your input. Let us know how we can improve your experience.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Feedback</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please share your thoughts, suggestions, or report any issues..." 
                      className="min-h-[150px]" 
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your feedback helps us improve the app for everyone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end gap-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Submit Feedback"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Contact;
