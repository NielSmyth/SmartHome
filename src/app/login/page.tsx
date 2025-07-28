'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Home, Shield } from 'lucide-react';
import { useAppContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';
import bcrypt from 'bcryptjs';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signInSchema>) {
    setIsLoading(true);
    try {
      await login(values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
        toast({
          title: "Login Failed",
          description: error.message || "Please check your email and password.",
          variant: "destructive",
        });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <Home className="w-8 h-8 text-blue-400" />
          <Shield className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold font-headline">
          Smart Home Automation
        </h1>
        <p className="text-slate-300 mt-2">
          Secure access to your smart home dashboard
        </p>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome Back!</CardTitle>
          <CardDescription className="text-slate-400 pt-2">
            Enter your credentials to access your dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 focus:bg-slate-700"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link href="/signup" className="underline text-blue-400 hover:text-blue-300">
              Sign Up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Import or define db_getUserByEmail at the top of your file
import { db_getUserByEmail } from '@/lib/database'; // Adjust the import path as needed

export async function loginUser(email: string, password: string) {
  const user = await db_getUserByEmail(email);
  if (!user) return null;
  // Adjust the property name to match the actual hashed password field in your UserProfile type
  const hashedPassword = (user as any).hashedPassword || (user as any).passwordHash || (user as any).password;
  if (!hashedPassword) return null;
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch ? user : null;
}
