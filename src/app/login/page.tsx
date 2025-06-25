'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Shield } from 'lucide-react';
import { useAppContext } from '@/context/app-state-context';
import { useToast } from '@/hooks/use-toast';

const signInSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAppContext();
  const { toast } = useToast();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSignInSubmit(values: z.infer<typeof signInSchema>) {
    // Dev login logic
    if (values.email === 'admin@example.com' && values.password === 'adminpassword') {
      login('admin');
      router.push('/dashboard');
    } else if (values.email === 'user@example.com' && values.password === 'password123') {
      login('user');
      router.push('/dashboard');
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
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
          Smart Home Control
        </h1>
        <p className="text-slate-300 mt-2">
          Secure access to your smart home dashboard
        </p>
      </div>

      <Card className="w-full max-w-md bg-slate-800/50 border-slate-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome!</CardTitle>
           <CardDescription className="text-slate-400 pt-2">
            Use these credentials for development access:
            <ul className="list-disc pl-5 mt-2 text-slate-300">
              <li><b>Admin:</b> admin@example.com / adminpassword</li>
              <li><b>User:</b> user@example.com / password123</li>
            </ul>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...signInForm}>
            <form
              onSubmit={signInForm.handleSubmit(onSignInSubmit)}
              className="space-y-4"
            >
              <FormField
                control={signInForm.control}
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
                control={signInForm.control}
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
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
