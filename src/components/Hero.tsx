import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const Hero = () => {
  return (
    <div className="container mx-auto px-4 py-20">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Your AI-Powered Career Partner
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Let our AI help you find the perfect job, craft stunning resumes, and write compelling cover letters tailored to your career goals.
        </p>
        <div className="flex justify-center space-x-4">
          <Button className="bg-primary text-white hover:bg-primary/90 text-lg px-8 py-6">
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};