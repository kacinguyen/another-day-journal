
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Book, MessageCircle, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    user,
    signOut
  } = useAuth();

  const navItems = [{
    name: "Journal Log",
    path: "/",
    icon: <Book className="h-5 w-5" />
  }, {
    name: "Conversations",
    path: "/conversations",
    icon: <MessageCircle className="h-5 w-5" />
  }];

  const handleSignOut = async () => {
    await signOut();
    // AuthContext will handle navigation to login
  };
  
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto'
    });
  }, [location.pathname]);
  
  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      navigate(path);
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/home" className="text-sm uppercase font-semibold tracking-tight hover:text-primary transition-colors">
            Another Day Another Entry
          </Link>
          
          <nav className="hidden md:flex gap-6">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center gap-1.5">
                  {item.icon}
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
          {user ? <>
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
            </> : <>
              <Link to="/login" className="hidden md:flex text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-4">
                Log in
              </Link>
              <Link to="/signup">
                <Button size="sm" className="hidden md:flex">
                  Get started
                </Button>
              </Link>
            </>}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="outline" size="sm">
                {user ? <User className="h-4 w-4 mr-2" /> : null}
                Account
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user ? <>
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
                </> : <>
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="w-full cursor-pointer">
                      <span>Log in</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/signup" className="w-full cursor-pointer">
                      <span>Get started</span>
                    </Link>
                  </DropdownMenuItem>
                </>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="md:hidden flex">
          {navItems.map(item => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={cn(
                "px-3 py-2",
                location.pathname === item.path ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className="flex flex-col items-center gap-0.5">
                {item.icon}
                <span className="text-xs">{item.name}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </header>;
};

export default Navbar;
