import { Button } from "@/components/ui/button";
import {  motion, useAnimation } from "framer-motion";
import { BriefcaseIcon, Crown, LogOut, Bookmark, LetterText } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Navbar = () => {
  const navigate = useNavigate();
  const controls=useAnimation();
  const handleHover =() => {
    controls.start({x:[0,-10,5,-1,0], transition: {duration:0.7}});
  };
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
            <span className="text-xl font-bold text-primary">Jobdin</span>
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
      
            <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center "

          >
            <LogOut className="mr-2 h-4 w-4  " />
            <motion.button
              onHoverStart={handleHover}
              onHoverEnd={()=> controls.start({x:0})}
              animate={controls}
              className=" text-black rounded-xl text-[17px]  mt-3 mb-2">Sign out
           </motion.button>
           
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