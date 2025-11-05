import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, PiggyBank, Target } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              For Students & Young Professionals
            </span>
          </div>
          
          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent-foreground bg-clip-text text-transparent">
              Somu
            </span>
            <br />
            <span className="text-foreground">
              Personal Finance Tracker
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A beginner-friendly platform to simplify expense tracking, 
            visualize your financial journey, and cultivate smart money habits
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button size="lg" className="group shadow-lg hover:shadow-xl transition-all">
              Get Started
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </div>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <FeatureCard
              icon={<PiggyBank className="w-6 h-6" />}
              title="Track Expenses"
              description="Effortless logging with smart categorization"
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Visual Insights"
              description="Clear charts and financial analytics"
            />
            <FeatureCard
              icon={<Target className="w-6 h-6" />}
              title="Achieve Goals"
              description="Set and monitor your savings targets"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg">
      <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-lg mb-2 text-foreground">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

export default Hero;
