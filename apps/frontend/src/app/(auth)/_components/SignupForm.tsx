"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [otpSent, setOtpSent] = useState(false); // Added state for OTP step
  const [otp, setOtp] = useState("");
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
    setLoading(true);
    setError("");
    setSuccess("");

    if (!otpSent) {
      // Step 1: Send email only to signup
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: values.email }), // Only sending email
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Signup failed");
        }

        setOtpSent(true); // Move to OTP step
        setSuccess("OTP sent to your email. Verify to continue.");
      } catch (error :any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    } else {
      // Step 2: Verify OTP and complete registration
      try {
        const res = await fetch("http://localhost:8000/api/v1/auth/otp-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: values.email,
            name: values.name,
            password: values.password,
            otp,
          }),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "OTP verification failed");
        }

        setSuccess("Signup successful! Redirecting...");
        router.push("/dashboard");
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 w-[300px]">
      <Image
        src="/demo-logo.png"
        width={400}
        height={400}
        alt="logo"
        className="w-24"
      />
      <h1 className="text-2xl font-semibold">Welcome.</h1>
      <p className="text-center text-[#6b7280] text-sm -mt-1">Sign up to create your account.</p>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full gap-3 flex flex-col"
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {otpSent && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>OTP</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </FormControl>
              </FormItem>
            </>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Processing..." : otpSent ? "Verify OTP" : "Sign Up"}
            <MoveRight />
          </Button>
        </form>
      </Form>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-500 text-sm">{success}</p>}
      <div className="flex items-center justify-center gap-1 w-full">
        <p className="text-[16px]">Already have an account?</p>
        <Link href="/login">
          <p className="text-[16px] text-blue-500">Log in</p>
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
