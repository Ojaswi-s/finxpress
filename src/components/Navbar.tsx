import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Somu
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors font-medium">
              Home
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors font-medium">
              Features
            </a>
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors font-medium">
              Dashboard
            </a>
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4 border-t border-border">
            <a
              href="#home"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Home
            </a>
            <a
              href="#features"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Features
            </a>
            <a
              href="#dashboard"
              className="block px-4 py-2 text-foreground hover:bg-muted rounded-lg transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Dashboard
            </a>
            <div className="flex flex-col gap-2 px-4">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
              <Button className="w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
