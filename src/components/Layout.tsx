import { Navbar } from "./Navbar";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { BriefcaseIcon, BookmarkIcon, FileTextIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Jobs",
    icon: BriefcaseIcon,
    href: "/",
  },
  {
    title: "Applications",
    icon: FileTextIcon,
    href: "/applications",
  },
  {
    title: "Saved Jobs",
    icon: BookmarkIcon,
    href: "/saved-jobs",
  },
  {
    title: "Profile",
    icon: UserIcon,
    href: "/profile",
  },
];

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="flex items-center justify-between px-4">
            <div className="flex items-center space-x-2">
              <BriefcaseIcon className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-primary">Jobedin</span>
            </div>
            <SidebarTrigger />
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1">
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
};