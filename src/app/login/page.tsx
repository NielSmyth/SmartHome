import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Home, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Home className="w-8 h-8 text-blue-400" />
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Smart Home Control
        </h1>
        <p className="text-slate-300 mt-2">
          Secure access to your smart home dashboard
        </p>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Authentication</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-900/60 border-slate-700 border">
              <TabsTrigger value="signin" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white">
                Sign In
              </TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-slate-950 data-[state=active]:text-white">
                Sign Up
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email-signin">Email</Label>
                  <Input
                    id="email-signin"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signin">Password</Label>
                  <Input
                    id="password-signin"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/dashboard">Sign In</Link>
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup" className="mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name-signup">Name</Label>
                  <Input
                    id="name-signup"
                    type="text"
                    placeholder="Enter your name"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-signup">Email</Label>
                  <Input
                    id="email-signup"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-signup">Password</Label>
                  <Input
                    id="password-signup"
                    type="password"
                    placeholder="Create a password"
                    className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                    required
                  />
                </div>
                 <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                  <Link href="/dashboard">Sign Up</Link>
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
