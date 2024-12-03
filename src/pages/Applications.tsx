import { AIJobSearch } from "@/components/AIJobSearch";
import { LayoutDashboard, Grid2X2, Columns3, Bookmark, LetterText } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, BookmarkPlus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";

type Job = Database['public']['Tables']['jobs']['Row'];

const Applications = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const saveJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase
        .from("saved_jobs")
        .insert({ 
          job_id: jobId,
          user_id: user.id 
        });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job saved successfully");
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
    onError: () => {
      toast.error("Failed to save job");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r min-h-screen p-4">
        <div className="flex items-center gap-2 mb-8">
          <LayoutDashboard className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">Jobedin</span>
        </div>
        <nav className="space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
          >
            <Grid2X2 className="h-5 w-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/applications"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Columns3 className="h-5 w-5" />
            <span>Applications</span>
          </Link>
          <Link
            to="/saved-jobs"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Bookmark className="h-5 w-5" />
            <span>Saved Jobs</span>
          </Link>
          <Link
            to="/yourchatbot"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <LetterText className="h-5 w-5" />
            <span>Your resume Builder</span>
          </Link>

        </nav>
      </aside>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Job Applications</h1>
        
        <div className="mb-8">
          <AIJobSearch />
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Salary Range</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  </TableCell>
                </TableRow>
              ) : jobs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No jobs found. Try using the AI Job Search above!
                  </TableCell>
                </TableRow>
              ) : (
                jobs?.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.title}</TableCell>
                    <TableCell>{job.company}</TableCell>
                    <TableCell>{job.location}</TableCell>
                    <TableCell>{job.job_type}</TableCell>
                    <TableCell>{job.salary_range}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedJob(job)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => saveJobMutation.mutate(job.id)}
                        >
                          <BookmarkPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selectedJob} onOpenChange={() => setSelectedJob(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Company</h3>
                <p>{selectedJob?.company}</p>
              </div>
              <div>
                <h3 className="font-semibold">Location</h3>
                <p>{selectedJob?.location}</p>
              </div>
              <div>
                <h3 className="font-semibold">Job Type</h3>
                <p>{selectedJob?.job_type}</p>
              </div>
              <div>
                <h3 className="font-semibold">Salary Range</h3>
                <p>{selectedJob?.salary_range}</p>
              </div>
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="whitespace-pre-wrap">{selectedJob?.description}</p>
              </div>
              {selectedJob?.url && (
                <div>
                  <Button
                    onClick={() => window.open(selectedJob.url, '_blank')}
                    className="w-full"
                  >
                    Apply Now
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
    </div>
    </div>
  );
};

export default Applications;