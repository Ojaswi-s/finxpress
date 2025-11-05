import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div id="home">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="dashboard">
        <Dashboard />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
