import { Bell, CircleUserRound, MonitorSmartphone, Sparkles } from "lucide-react";
import Image from "next/image";
import React from "react";

const Hero = () => {
  return (
    <section className="pb-6 flex items-center flex-col">
      <Image
        src={"/bg.png"}
        alt="background_image"
        width={1000}
        height={1000}
        className="w-full absolute top-0 left-0"
      />
      <div className="relative w-full h-full flex flex-col justify-center items-center pt-[180px] ">
        <div className="bg-[#F4F7F9] p-1.5 pr-3 rounded-full border border-[#DDE5ED]">🚀🚀🚀 Join 1000+ member</div>
        <div className="text-center">
          <h1 className="text-[70px] max-w-[1000px] leading-[1.2] mt-3 font-bold">Streamline Tasks with Clever’s Productivity Solutions.</h1>
          <p className="text-[20px] mt-4 mb-8 opacity-60">
            Elevate Your Productivity with Clever’s Intelligent Tools for Seamless Task <br></br>and Workflow Management.
          </p>
          <div className="flex gap-5  items-center justify-center w-full">
            <button className="text-white bg-black border-2 border-black px-6 flex items-center justify-center py-4 rounded-full">Get Start ...</button>
            <button className="border-2 border-[#d1d1d1] bg-[#F4F7F9] px-6 flex items-center py-4 rounded-full">Learn More</button>
          </div>
        </div>
        <div className="flex justify-center w-[1280px] my-10">
          <Image
            alt="banner"
            src="/banner.png"
            width={1000}
            height={1000}
            className="w-full rounded-3xl border-2 border-[#d1d1d16d]"
          />
        </div>
      </div>
      <div className="h-[2px] bg-black/10 w-[1000px] mt-6" />
      <div className="flex items-center max-w-[1000px] w-full justify-between my-16">
        {[
          { id: 0, title: "Cross-Platform Compatibility", Icon: <MonitorSmartphone /> },
          { id: 1, title: "Smart Deadline Reminders", Icon: <Bell /> },
          { id: 2, title: "Smart Deadline Reminders", Icon: <Sparkles /> },
          { id: 3, title: "Smart Deadline Reminders", Icon: <CircleUserRound /> },
        ].map((item) => {
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center justify-center gap-2 w-full ${item.id !== 3 ? " border-r-2" : ""}`}
            >
              <div className="bg-[#eaeaea] p-1.5 border rounded-full">
                <div className="bg-zinc-800 text-white p-3 rounded-full">{item.Icon}</div>
              </div>
              <h3 className="text-lg font-semibold w-[150px] text-center leading-tight">{item.title}</h3>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Hero;
