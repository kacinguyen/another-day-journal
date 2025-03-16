
import { Link, useLocation } from "react-router-dom";
import { Book, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const location = useLocation();
  
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
                "flex items-center text-sm font-medium transition-colors hover:text-accent",
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
