import { Button } from "@/components/ui/button";
import { BriefcaseIcon, Crown, LogOut, Bookmark, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
        <div className="flex items-center space-x-6">
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseIcon className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">Jobedin</span>
          </Link>
          <Link
            to="/applications"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Applications
          </Link>
          <Link
            to="/saved-jobs"
            className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
          >
            <Bookmark className="h-4 w-4" />
            <span>Saved Jobs</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-premium text-premium-foreground hover:bg-premium/90">
            <Crown className="mr-2 h-4 w-4" />
            Go Premium
          </Button>
        </div>
      </div>
    </nav>
  );
};