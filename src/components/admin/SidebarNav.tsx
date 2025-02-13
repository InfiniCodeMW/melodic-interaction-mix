
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Settings, 
  MessageSquare, 
  ChevronLeft,
  ChevronRight,
  BarChart,
  FileEdit,
  User
} from "lucide-react";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarNav({ className }: SidebarNavProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "fixed top-0 left-0 z-30 h-screen bg-gray-900/90 backdrop-blur-sm border-r border-gray-800 transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-4 top-4 z-40 rounded-full border border-gray-800 bg-gray-900"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>

        <ScrollArea className="h-full py-6">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className={cn(
                "mb-2 px-4 text-lg font-semibold tracking-tight text-white transition-all",
                isCollapsed && "opacity-0"
              )}>
                Dashboard
              </h2>
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Overview</span>}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard/content">
                    <FileEdit className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Content</span>}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard/comments">
                    <MessageSquare className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Comments</span>}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard/analytics">
                    <BarChart className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Analytics</span>}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard/profile">
                    <User className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Profile</span>}
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white/70 hover:text-white hover:bg-gray-800",
                    !isCollapsed && "px-2"
                  )}
                  asChild
                >
                  <Link to="/dashboard/settings">
                    <Settings className={cn("h-5 w-5", !isCollapsed && "mr-2")} />
                    {!isCollapsed && <span>Settings</span>}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      {/* Spacer to prevent content from being hidden behind the sidebar */}
      <div className={cn(
        "transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )} />
    </div>
  );
}
