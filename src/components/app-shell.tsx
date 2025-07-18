
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
  Bell,
  Mic,
  Loader,
  Users,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useAppContext } from "@/context/app-state-context";
import { parseVoiceCommand } from "@/ai/flows/voice-command-flow";
import { textToSpeech } from "@/ai/flows/text-to-speech-flow";
import { useToast } from "@/hooks/use-toast";

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
];

const adminMenuItem = {
    href: "/admin",
    label: "Admin",
    icon: Users,
};

const profileMenuItem = {
    href: "/profile",
    label: "Profile",
    icon: User,
};


export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme } = useTheme();
  const { toast } = useToast();

  const {
    user,
    authLoading,
    devices,
    scenes,
    automations,
    handleDeviceToggle,
    handleActivateScene,
    handleAutomationToggle,
    logout,
    isAdmin,
  } = useAppContext();

  const [isProcessingVoice, setIsProcessingVoice] = React.useState(false);

  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const onVoiceResult = async (transcript: string) => {
    if (!transcript) return;

    setIsProcessingVoice(true);
    toast({
      title: "Processing Command...",
      description: `"${transcript}"`,
    });

    try {
      const deviceNames = devices.map((d) => d.name);
      const sceneNames = scenes.map((s) => s.name);
      const automationNames = automations.map((a) => a.name);

      const result = await parseVoiceCommand({
        command: transcript,
        devices: deviceNames,
        scenes: sceneNames,
        automations: automationNames,
      });

      let actionTaken = false;

      switch (result.action) {
        case "device":
          const device = devices.find((d) => d.name === result.target);
          if (device) {
            handleDeviceToggle(device.id);
            actionTaken = true;
          }
          break;
        case "scene":
          handleActivateScene(result.target);
          actionTaken = true;
          break;
        case "automation":
          const automation = automations.find(a => a.name === result.target);
          if (automation) {
            handleAutomationToggle(automation.id, result.value);
            actionTaken = true;
          }
          break;
        case "navigation":
          router.push(`/${result.target.toLowerCase()}`);
          actionTaken = true;
          break;
      }
      
      const speechResponse = actionTaken ? result.speechResponse : `Sorry, I couldn't find the ${result.target}.`;

      toast({
        title: actionTaken ? "Command Executed" : "Command Failed",
        description: speechResponse,
      });

      const { audioDataUri } = await textToSpeech(speechResponse);
      if (audioDataUri) {
        const audio = new Audio(audioDataUri);
        audio.play();
      }

    } catch (error) {
      console.error("Error processing voice command:", error);
      toast({
        title: "Error",
        description: "Sorry, I couldn't process that command.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingVoice(false);
    }
  };

  const { isListening, transcript, start, stop, supported } = useSpeechRecognition({
    onResult: onVoiceResult,
  });

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleVoiceButtonClick = () => {
    if (isListening) {
      stop();
    } else {
      start();
    }
  };

  const allMenuItems = isAdmin ? [...menuItems, adminMenuItem, profileMenuItem] : [...menuItems, profileMenuItem];

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen w-full">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4 flex items-center justify-between group-data-[state=collapsed]:p-2 group-data-[state=collapsed]:justify-center border-b">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/20 text-primary">
              <Lightbulb className="w-6 h-6 group-data-[state=collapsed]:w-4 group-data-[state=collapsed]:h-4" />
            </div>
            <h1 className="text-xl font-semibold font-headline group-data-[state=collapsed]:hidden">
              Smart Hub
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {allMenuItems.map((item) => (
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
        <SidebarFooter className="mt-auto border-t p-2 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full"
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
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="center" side="top">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Sun />
                  <span>Theme</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      <Sun />
                      <span>Light</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      <Moon />
                      <span>Dark</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      <Laptop />
                      <span>System</span>
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <DoorOpen />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="hidden md:flex" />
            <div className="flex items-center gap-2 md:hidden">
              <div className="p-1.5 rounded-lg bg-primary">
                <Lightbulb className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-semibold font-headline">Smart Hub</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {supported && (
               <Button variant="ghost" size="icon" onClick={handleVoiceButtonClick} disabled={isProcessingVoice} className="hidden md:inline-flex">
                {isProcessingVoice ? <Loader className="h-[1.2rem] w-[1.2rem] animate-spin" /> : (isListening ? <Loader className="h-[1.2rem] w-[1.2rem] animate-pulse text-red-500" /> : <Mic className="h-[1.2rem] w-[1.2rem]" />) }
                <span className="sr-only">Voice Command</span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-[1.2rem] w-[1.2rem]" />
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 justify-center rounded-full p-0 text-xs">2</Badge>
                  <span className="sr-only">Toggle notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <p className="font-medium">System Alert: Anomaly Detected</p>
                  <p className="text-xs text-muted-foreground">Unusual energy spike from Kitchen. - 5m ago</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col items-start gap-1 py-2">
                  <p className="font-medium">Automation: Good Night Triggered</p>
                  <p className="text-xs text-muted-foreground">All lights turned off and doors locked. - 2h ago</p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                 <DropdownMenuItem asChild>
                  <Button variant="link" className="w-full h-8 mt-1">View all notifications</Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
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
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <Settings />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Sun />
                    <span>Theme</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem onClick={() => setTheme("light")}>
                        <Sun />
                        <span>Light</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("dark")}>
                        <Moon />
                        <span>Dark</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme("system")}>
                        <Laptop />
                        <span>System</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <DoorOpen />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <SidebarTrigger className="md:hidden" />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        {supported && (
            <Button
                size="icon"
                onClick={handleVoiceButtonClick}
                disabled={isProcessingVoice}
                className="md:hidden fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
            >
                {isProcessingVoice ? <Loader className="h-6 w-6 animate-spin" /> : (isListening ? <Loader className="h-6 w-6 animate-pulse text-red-500" /> : <Mic className="h-6 w-6" />) }
                <span className="sr-only">Voice Command</span>
            </Button>
        )}
      </SidebarInset>
    </SidebarProvider>
  );
}
