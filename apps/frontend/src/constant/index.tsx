import { Bell, CircleUserRound, MonitorSmartphone, Sparkles } from "lucide-react";
import { HomeIcon, CircleUser, Settings, Users, Trophy } from "lucide-react";


export const Marquee = [
  { id: 0, title: "Cross-Platform Compatibility", Icon: <MonitorSmartphone /> },
  { id: 1, title: "Smart Deadline Reminders", Icon: <Bell /> },
  { id: 2, title: "Intuitive User Interface", Icon: <Sparkles /> },
  { id: 3, title: "Real-time Collaboration Tools", Icon: <CircleUserRound /> },
];

export const Menu = [
  { id: 0, title: "Home" },
  { id: 1, title: "About" },
  { id: 2, title: "Contact" },
];

export const menuItems = [
  { icon: <HomeIcon />, label: "Dashboard", href: "/dashboard" },
  { icon: <CircleUser />, label: "Random Mock Interview", href: "/dashboard/random" },
  { icon: <Settings />, label: "Custom Mock Interview", href: "/dashboard/custom" },
  { icon: <Users />, label: "Community", href: "/dashboard/community" },
  { icon: <Trophy />, label: "Leaderboard", href: "/dashboard/leaderboard" },
];