"use client";
import { menuItems } from "@/constant";
import Link from "next/link";
import { useRouter } from "next/navigation";

export const SidebarItem = () => {
  const router = useRouter();

  return (
    <div className="p-4">
      <div className="text-2xl font-bold text-gray-800 p-2 mb-4">Logo</div>
      <div className="flex flex-col gap-3">
        {menuItems.map((item, index) => (
          <Link href={item.href}
            className="flex items-center gap-2  px-2 py-2 text-gray-700 text-sm hover:bg-gray-200 transition rounded-lg w-full "
            key={index}
          >
            <div>{item.icon}</div>
            <p>{item.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
