import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const SavedJobs = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ["saved-jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("saved_jobs")
        .select(`
          *,
          jobs:job_id (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const deleteSavedJobMutation = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase
        .from("saved_jobs")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Job removed from saved");
      queryClient.invalidateQueries({ queryKey: ["saved-jobs"] });
    },
    onError: () => {
      toast.error("Failed to remove job");
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-2xl font-bold mb-8">Saved Jobs</h1>

        {/* Jobs Table */}
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
              ) : savedJobs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No saved jobs yet. Browse the Applications page to save jobs!
                  </TableCell>
                </TableRow>
              ) : (
                savedJobs?.map((savedJob) => (
                  <TableRow key={savedJob.id}>
                    <TableCell className="font-medium">
                      {savedJob.jobs.title}
                    </TableCell>
                    <TableCell>{savedJob.jobs.company}</TableCell>
                    <TableCell>{savedJob.jobs.location}</TableCell>
                    <TableCell>{savedJob.jobs.job_type}</TableCell>
                    <TableCell>{savedJob.jobs.salary_range}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedJob(savedJob.jobs)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSavedJobMutation.mutate(savedJob.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Job Description Dialog */}
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
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default SavedJobs;