import { Button } from "@/components/ui/button";
import { BriefcaseIcon, Crown, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <BriefcaseIcon className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">Jobedin</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
          <Button className="bg-premium text-premium-foreground hover:bg-premium/90">
            <Crown className="mr-2 h-4 w-4" />
            Go Premium
          </Button>
        </div>
      </div>
    </nav>
  );
};