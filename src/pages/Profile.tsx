import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const Profile = () => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    headline: "",
    bio: "",
    experience_level: "",
    preferred_location: "",
    skills: [] as string[],
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedProfile: typeof formData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("profiles")
        .update(updatedProfile)
        .eq("id", user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleEdit = () => {
    setFormData({
      full_name: profile?.full_name || "",
      headline: profile?.headline || "",
      bio: profile?.bio || "",
      experience_level: profile?.experience_level || "",
      preferred_location: profile?.preferred_location || "",
      skills: profile?.skills || [],
    });
    setIsEditing(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(formData);
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <Input
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Headline</label>
                <Input
                  value={formData.headline}
                  onChange={(e) =>
                    setFormData({ ...formData, headline: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Experience Level
                </label>
                <Input
                  value={formData.experience_level}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_level: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Preferred Location
                </label>
                <Input
                  value={formData.preferred_location}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      preferred_location: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Skills (comma-separated)
                </label>
                <Input
                  value={formData.skills.join(", ")}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills: e.target.value.split(",").map((s) => s.trim()),
                    })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Full Name</h3>
                <p>{profile?.full_name}</p>
              </div>
              <div>
                <h3 className="font-medium">Headline</h3>
                <p>{profile?.headline}</p>
              </div>
              <div>
                <h3 className="font-medium">Bio</h3>
                <p>{profile?.bio}</p>
              </div>
              <div>
                <h3 className="font-medium">Experience Level</h3>
                <p>{profile?.experience_level}</p>
              </div>
              <div>
                <h3 className="font-medium">Preferred Location</h3>
                <p>{profile?.preferred_location}</p>
              </div>
              <div>
                <h3 className="font-medium">Skills</h3>
                <p>{profile?.skills?.join(", ")}</p>
              </div>
              <Button onClick={handleEdit}>Edit Profile</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;