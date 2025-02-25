import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoveRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const page = () => {
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
      <div className=" w-full">
        <Label className=" text-[#6b7280] text-sm mb-2">Eamil</Label>
        <Input
          className="w-full text-sm bg-white border-blue-500  focus:bg-[#eaf5fb]"
          type="email"
          placeholder="Enter your email"
        />
      </div>
      <div className=" w-full">
        <Label className=" text-[#6b7280] text-sm mb-2">Password</Label>
        <Input
          className="w-full text-sm bg-white border-blue-500 focus:bg-[#eaf5fb]"
          type="password"
          placeholder="Enter your password"
        />
      </div>
      <div className=" border-b-2 w-full my-3 border-zinc-300" />
      <div className="w-full">
        <Button className="w-full bg-gradient-to-tl from-[#724bff] to-[#4f2dfb] text-white">
          Sign In
          <MoveRight />
        </Button>
      </div>
      <div className="flex items-center justify-center gap-1 w-full">
        <p className="text-[16px]">No account?</p>
        <Link href="/signup">
        <p className="text-[16px] text-blue-500">Create an account</p>
        </Link>
      </div>
    </div>
  );
};

export default page;
