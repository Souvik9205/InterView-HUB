"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { registerSchema } from "../../../../validators/auth-validator";

const SignupForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({ name: "", password: "" });

  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (values: any) => {
    // console.log(values);
    
    setLoading(true);
    setError("");
    setSuccess("");

    const name = await values.name;
    const email = await values.email;
    const password = await values.password;

    if (!name || !email || !password) return setError("Filled all details");
    else {
      try {
        let res = await fetch("http://localhost:8000/api/v1/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email }),
        });
        let data = await res.json();
        if (res.ok) {
          setUserData({ name, password }); // Store name and password in state
          setSuccess("OTP sent to your email.");
          router.push(`/auth/verify?email=${email}`); // Navigate to OTP page
        } else if (!res.ok) {
          setLoading(false); // Set loading to false
          setError(data.message);
        }
      } catch (error) {
        console.log("Error in sign up", error);
        setLoading(false); // Set loading to false
      } finally {
        setLoading(false);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className=" text-[#6b7280] text-sm ">Name</FormLabel>
                <FormControl>
                  <Input
                    className="w-full text-sm bg-white border-blue-300 focus:border-blue-500  focus:bg-[#eaf5fb] !mt-0"
                    type="name"
                    placeholder="Enter your name"
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
                <FormLabel className=" text-[#6b7280] text-sm ">Email</FormLabel>
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
        <p className="text-[16px]">Already have an accout?</p>
        <Link href="/login">
          <p className="text-[16px] text-blue-500">Log in</p>
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
