import { menuItems } from "@/constant";
import {  SidebarItem } from "./_components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col space-y-4">
        <SidebarItem/>
      </aside>

      {/* Main Content */}
      <aside className="flex-1 p-6 overflow-auto">{children}</aside>
    </div>
  );
}
