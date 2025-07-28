'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import bcrypt from 'bcryptjs';

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
import { useToast } from '@/hooks/use-toast';
import { createUserInDb } from '@/lib/database';

const signUpSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters.' }),
});

export async function createUser(email: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  // Save email and hashedPassword to DB
}

export default function SignUpPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof signUpSchema>) {
    try {
      // Hash password and save user to DB
      await createUserInDb({
        fullName: values.fullName,
        email: values.email,
        password: values.password,
      });
      toast({
        title: "Account Created!",
        description: "You've been successfully signed up. Please log in.",
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: "Sign Up Failed",
        description: error.message || "Could not create account.",
        variant: "destructive",
      });
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
          Create Your Account
        </h1>
        <p className="text-slate-300 mt-2">
          Join to manage your smart home with ease.
        </p>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Sign Up</CardTitle>
           <CardDescription className="text-slate-400 pt-2">
            Enter your details to create a new account.
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
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
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
              >
                Create Account
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="underline text-blue-400 hover:text-blue-300">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
