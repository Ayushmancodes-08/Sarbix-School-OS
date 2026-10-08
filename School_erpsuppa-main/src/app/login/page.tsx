"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { School } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { signIn } from "next-auth/react";

const loginFormSchema = z.object({
  username: z.string().min(1, "User ID is required."),
  password: z.string().min(1, "Password is required."),
  role: z.string({ required_error: "Please select a role." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    }
  });

  async function onSubmit(data: LoginFormValues) {
    console.log('Login attempt:', data);
    
    try {
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        role: data.role,
        redirect: false,
      });

      if (result?.error) {
        console.log('Login failed:', result.error);
        toast({
          title: "Login Failed",
          description: result.error || "Invalid credentials. Check console for details.",
          variant: "destructive",
        });
      } else {
        console.log('Login successful');
        toast({
          title: "Login Successful",
          description: `Welcome, ${data.role}!`,
        });

        sessionStorage.setItem("authenticated", "true");
        sessionStorage.setItem("userRole", data.role);
        
        // Fetch session to get studentId if any
        const res = await fetch('/api/auth/session');
        const session = await res.json();
        
        if (data.role === 'Student' && session?.user?.studentId) {
          sessionStorage.setItem("studentId", session.user.studentId);
        } else {
          sessionStorage.removeItem("studentId");
        }

        router.push("/");
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-full">
                    <School className="h-8 w-8" />
                </div>
            </div>
          <CardTitle className="text-3xl font-bold font-headline">School ERP</CardTitle>
          <CardDescription>Enter your credentials to login</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Teacher">Teacher</SelectItem>
                        <SelectItem value="Student">Student</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User ID</FormLabel>
                    <FormControl>
                        <Input placeholder="Your user ID" {...field} />
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
                        <Input type="password" placeholder="Your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col items-start gap-4">
          <Separator />
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">New to our school?</p>
            <div className="flex flex-col gap-2">
                 <Link href="/admissions" className="font-medium text-primary hover:underline">
                    New student? Apply for admission
                 </Link>
                 <Link href="/careers" className="font-medium text-primary hover:underline">
                    Looking for a job? Apply here
                 </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
