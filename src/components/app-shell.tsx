"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Lightbulb,
  LayoutDashboard,
  Home,
  Wand2,
  Zap,
  BarChart2,
  Shield,
  User,
  Settings,
  UserCircle,
  DoorOpen,
  Moon,
  Sun,
  Laptop,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/rooms",
    label: "Rooms",
    icon: Home,
  },
  {
    href: "/scenes",
    label: "Scenes",
    icon: Wand2,
  },
  {
    href: "/automations",
    label: "Automations",
    icon: Zap,
  },
  {
    href: "/energy",
    label: "Energy Monitor",
    icon: BarChart2,
  },
  {
    href: "/system",
    label: "System Status",
    icon: Shield,
  },
  {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleLogout = () => {
    // In a real app, you would clear session/token here
    router.push("/login");
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-semibold font-headline group-data-[state=collapsed]:hidden">
              Smart Hub
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span className="group-data-[state=collapsed]:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="justify-start w-full gap-2 px-2 h-11"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://placehold.co/40x40.png"
                    alt="User Avatar"
                    data-ai-hint="user avatar"
                  />
                  <AvatarFallback>
                    <UserCircle />
                  </AvatarFallback>
                </Avatar>
                <span className="text-base group-data-[state=collapsed]:hidden">
                  User
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mb-2"
              side="top"
              align="start"
            >
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings className="mr-2" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun className="mr-2" />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun className="mr-2" />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon className="mr-2" />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop className="mr-2" />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <DoorOpen className="mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-1.5 rounded-lg bg-primary">
                <Lightbulb className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold font-headline">Smart Hub</h1>
            </div>
          </div>
          <SidebarTrigger className="md:hidden" />
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
