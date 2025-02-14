import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SidebarNav } from "@/components/admin/SidebarNav";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface Profile {
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
}

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Profile>({
    username: "",
    full_name: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    checkAdminStatus();
    fetchProfile();
  }, []);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
      return;
    }

    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!adminUser) {
      navigate("/");
      toast({
        title: "Access Denied",
        description: "You do not have admin privileges.",
        variant: "destructive",
      });
    }
  };

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        username: data.username || "",
        full_name: data.full_name || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || "",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          avatar_url: formData.avatar_url,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
      setIsEditing(false);
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-primary">
        <div className="flex">
          <SidebarNav />
          <main className="flex-1">
            <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
              <Skeleton className="h-10 w-32 bg-gray-800" />
            </div>
            <div className="p-8">
              <div className="max-w-2xl mx-auto">
                <Card className="bg-gray-900/50 border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-48 bg-gray-800" />
                      <Skeleton className="h-10 w-28 bg-gray-800" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                        <Skeleton className="h-10 w-full bg-gray-800" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary">
      <div className="flex">
        <SidebarNav />
        <main className="flex-1">
          <div className="sticky top-0 z-10 bg-primary border-b border-gray-800 p-8">
            <h1 className="text-3xl font-bold text-white">Profile</h1>
          </div>
          <div className="p-8">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gray-900/50 border-gray-800">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-white">Profile Information</CardTitle>
                    <Button 
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <Input
                          value={formData.username || ""}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <Input
                          value={formData.full_name || ""}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Bio</label>
                        <Textarea
                          value={formData.bio || ""}
                          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                          className="bg-white/10 border-white/20 text-white"
                        />
                      </div>
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm text-gray-400">Username</label>
                        <p className="text-white">{profile?.username || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Full Name</label>
                        <p className="text-white">{profile?.full_name || "Not set"}</p>
                      </div>
                      <div>
                        <label className="text-sm text-gray-400">Bio</label>
                        <p className="text-white">{profile?.bio || "No bio provided"}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Profile;
