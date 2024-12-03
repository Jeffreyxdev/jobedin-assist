import { LayoutDashboard, Grid2X2, Columns3, Bookmark, LetterText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { data: jobs } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  // Calculate statistics
  const totalApplications = jobs?.length || 0;
  const interviewsScheduled = 0; // This would need to be implemented with a proper interviews tracking system
  const responseRate = totalApplications > 0 ? Math.round((interviewsScheduled / totalApplications) * 100) : 0;

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

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Applications
                  </CardTitle>
                  <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalApplications}</div>
                  <p className="text-xs text-muted-foreground">
                    From AI Job Search
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Interviews Scheduled
                  </CardTitle>
                  <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{interviewsScheduled}</div>
                  <p className="text-xs text-muted-foreground">
                    Pending implementation
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Response Rate
                  </CardTitle>
                  <Grid2X2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{responseRate}%</div>
                  <p className="text-xs text-muted-foreground">
                    Based on interviews scheduled
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Applications */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {jobs?.slice(0, 3).map((job) => (
                    <div
                      key={job.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h3 className="font-medium">{job.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;