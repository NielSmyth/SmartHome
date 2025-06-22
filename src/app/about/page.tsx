import {
  Home,
  Shield,
  Smartphone,
  Zap,
  Wand2,
  Lock,
  Users,
  Calendar,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    icon: Smartphone,
    title: 'Device Control',
    description: 'Control all your smart home devices from one central dashboard.',
  },
  {
    icon: Zap,
    title: 'Energy Monitoring',
    description: "Track energy usage and optimize your home's efficiency.",
  },
  {
    icon: Wand2,
    title: 'Automation',
    description: 'Create custom automation rules for your devices.',
  },
  {
    icon: Lock,
    title: 'Security',
    description: 'Monitor your home security cameras and door locks.',
  },
  {
    icon: Users,
    title: 'Multi-User',
    description: 'Share access with family members with different permission levels.',
  },
  {
    icon: Calendar,
    title: 'Scheduling',
    description: 'Schedule devices to turn on/off at specific times.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-900 text-white">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center py-20 lg:py-32">
          <div className="flex justify-center items-center gap-4 mb-6">
            <Home className="w-8 h-8 text-blue-400" />
            <Shield className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 font-headline">
            Smart Home Control Center
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-300 mb-8">
            Take complete control of your smart home with our intuitive dashboard.
            Monitor, automate, and optimize your connected devices from anywhere.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent border-slate-300 text-slate-300 hover:bg-slate-800 hover:text-white">
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="text-center mb-12">
            <Badge variant="outline" className="text-sm bg-slate-700 border-slate-600 text-blue-300">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mt-4 mb-2 font-headline">
              Everything you need for smart home management
            </h2>
            <p className="max-w-2xl mx-auto text-slate-400">
              Our comprehensive platform provides all the tools you need to create the
              perfect smart home experience.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                </div>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 font-headline">
            Ready to transform your home?
          </h2>
          <p className="max-w-2xl mx-auto text-slate-300 mb-8">
            Join thousands of homeowners who have already made their homes
            smarter, safer, and more efficient.
          </p>
          <Button asChild size="lg">
            <Link href="/login">Start Your Smart Home Journey</Link>
          </Button>
        </section>
      </div>
    </div>
  );
}