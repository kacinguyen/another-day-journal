
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Book, LogIn, LogOut, MessageCircle, User, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const navItems = [
    {
      name: "Journal Log",
      path: "/",
      icon: <Book className="h-5 w-5" />
    },
    {
      name: "Conversations",
      path: "/conversations",
      icon: <MessageCircle className="h-5 w-5" />
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    // AuthContext will handle navigation to login
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight">Reflect</span>
          <span className="text-sm text-muted-foreground font-light">Journal</span>
        </div>
        
        <nav className="hidden md:flex gap-6">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center gap-1.5">
                {item.icon}
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/profile">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </Link>
              <Button variant="outline" size="sm" className="hidden md:flex" onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="hidden md:flex">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </Link>
            </>
          )}
          
          {/* Mobile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                {user ? <User className="h-4 w-4 mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full cursor-pointer">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Log in</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup" className="w-full cursor-pointer">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign up</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="md:hidden flex">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-3 py-2",
                location.pathname === item.path
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-center gap-0.5">
                {item.icon}
                <span className="text-xs">{item.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
