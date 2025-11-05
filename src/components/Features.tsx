import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, LineChart, Zap, Shield } from "lucide-react";

const Features = () => {
  return (
    <section className="py-24 px-4 bg-muted/30">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Our Vision: Financial Empowerment
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Designed for beginners to build better financial habits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Simplify Expense Tracking"
            description="Effortless logging for college students & young professionals with smart auto-categorization."
            gradient="from-primary to-primary-glow"
          />
          <FeatureCard
            icon={<Users className="w-8 h-8" />}
            title="Beginner-Friendly Platform"
            description="Intuitive design for financial newcomers. No complex jargon, just simple money management."
            gradient="from-accent-foreground to-blue-500"
          />
          <FeatureCard
            icon={<LineChart className="w-8 h-8" />}
            title="Clear Financial Insights"
            description="Visualize savings, spending, and goal progress with interactive charts and reports."
            gradient="from-orange-500 to-red-500"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Cultivate Smart Habits"
            description="Tools to foster better money management and achieve your financial goals faster."
            gradient="from-green-500 to-emerald-500"
          />
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  icon,
  title,
  description,
  gradient,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
}) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-border overflow-hidden">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardHeader>
        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradient} text-white mb-4 w-fit group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <CardTitle className="text-2xl mb-3">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
};

export default Features;
