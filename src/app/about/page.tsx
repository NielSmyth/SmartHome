import { Home } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary">
              <Home className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-3xl font-headline">About AssistHome</CardTitle>
              <CardDescription>Your Smart Home, Simplified.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            AssistHome is a revolutionary smart home application designed to bring convenience,
            efficiency, and intelligence to your fingertips. Our platform seamlessly integrates with
            your smart devices, allowing you to control, automate, and monitor your home from anywhere
            in the world.
          </p>
          <p>
            Powered by cutting-edge AI, AssistHome learns your habits to suggest personalized scenes
            and automations, optimizes energy consumption to save you money, and proactively monitors
            your system's health to prevent issues before they arise.
          </p>
          <p>
            Our mission is to make smart home technology accessible and intuitive for everyone.
            Whether you're a tech enthusiast or just getting started, AssistHome provides a powerful
            yet user-friendly experience to enhance your daily life.
          </p>
          <div className="pt-4 text-center">
            <Button asChild>
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
