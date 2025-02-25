import { Menu } from "@/constant";
import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="fixed top-7 left-0 right-0 z-50 flex items-center justify-center">
      <div className="w-[1000px] backdrop-blur-md h-[85px] rounded-full bg-[#0c0c0cd9] p-3 flex items-center justify-between">
        <div className="bg-[#f8f8f8] w-[130px] rounded-full h-full flex items-center justify-center font-semibold text-2xl">Sayan</div>
        <div className="flex items-center justify-between gap-10 text-white rounded-full h-full">
          {Menu.map((item) => {
            return (
              <Link
                href="#"
                key={item.id}
              >
                <p>{item.title}</p>
              </Link>
            );
          })}
        </div>
        <Link
          className="bg-[#f8f8f8] w-[130px] rounded-full h-full flex items-center justify-center "
          href="/login"
        >
          Log in
        </Link>
      </div>
    </nav>
  );
};

export default Header;
