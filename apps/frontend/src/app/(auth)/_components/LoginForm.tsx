"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../../validators/auth-validator";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: any) => {
    setLoading(true); // Set loading to true
    const email = await values.email;
    const password = await values.password;

    if (!email || !password) {
      return setError("Filled all details");
    } else {
      try {
        let res = await fetch("/api/auth/login", {
          method: "POST",
          body: JSON.stringify(values),
        });
        let data = await res.json();
        if (res.ok) {
          router.refresh();
          setSuccess(data.message);
          setLoading(false); // Set loading to false
        } else {
          setLoading(false); // Set loading to false
          setError(data.message);
        }
      } catch (error) {
        console.log("Error in login", error);
        setLoading(false); // Set loading to false
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-[300px] ">
      <Image
        src="/demo-logo.png"
        width={400}
        height={400}
        alt="logo"
        className="w-24"
      />
      <h1 className="text-2xl font-semibold">.Welcome back.</h1>
      <p className="text-center text-[#6b7280] text-sm -mt-1">
        Sign in to access to your dashboard,
        <br /> settings and projects
      </p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full gap-3 flex flex-col"
          noValidate
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-[#6b7280] text-sm ">Eamil</FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-sm bg-white border-blue-300 focus:border-blue-500  focus:bg-[#eaf5fb] !mt-0"
                    type="email"
                    placeholder="Enter your email"
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
                <FormLabel className=" text-[#6b7280] text-sm mb-2">Password</FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-sm bg-white border-blue-300 focus:border-blue-500  focus:bg-[#eaf5fb] !mt-0"
                    type="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className=" border-b-2 w-full my-3 border-zinc-300" />
          <div className="w-full">
            <Button className="w-full bg-gradient-to-tl from-[#724bff] to-[#4f2dfb] text-white">
              Sign In
              <MoveRight />
            </Button>
          </div>
        </form>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}

      <div className="flex items-center justify-center gap-1 w-full">
        <p className="text-[16px]">No account?</p>
        <Link href="/signup">
          <p className="text-[16px] text-blue-500">Create an account</p>
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
