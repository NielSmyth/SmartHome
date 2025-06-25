"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AirVent,
  Bell,
  BrainCircuit,
  Camera,
  Clock,
  DoorOpen,
  Flame,
  Lamp,
  Lightbulb,
  LightbulbOff,
  Lock,
  Sparkles,
  Sunrise,
  Sunset,
  Tv,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Types
export interface Device {
  name: string;
  location: string;
  icon: LucideIcon;
  type: string;
  status: string;
  time: string;
  active: boolean;
  statusVariant: "default" | "secondary" | "destructive";
}

export interface RoomDevice {
    name: string;
    type: string;
    icon: LucideIcon;
    active: boolean;
}

export interface Room {
    name: string;
    temp: number;
    lightsOn: number;
    lightsTotal: number;
    devices: RoomDevice[];
}

export interface Scene {
    name: string;
    icon: LucideIcon;
    description: string;
}

export interface Automation {
    icon: LucideIcon;
    name: string;
    description: string;
    trigger: string;
    action: string;
    status: string;
    lastRun: string;
    active: boolean;
}

export interface NewAutomationData {
  name: string;
  description: string;
  trigger: string;
  action: string;
}

interface AppState {
  devices: Device[];
  rooms: Room[];
  scenes: Scene[];
  automations: Automation[];
  handleDeviceToggle: (deviceName: string, roomName?: string) => void;
  handleAllLights: (roomName: string, turnOn: boolean) => void;
  handleActivateScene: (sceneName: string) => void;
  handleCreateScene: (name: string, description: string) => void;
  handleAutomationToggle: (automationName: string, forceState?: boolean) => void;
  handleCreateAutomation: (data: NewAutomationData) => void;
}

// Initial Data
const initialDevices: Device[] = [
  { name: 'Living Room Lights', location: 'Living Room', icon: Lightbulb, type: 'light', status: 'On', time: '2 min ago', active: true, statusVariant: 'default' },
  { name: 'Kitchen Lights', location: 'Kitchen', icon: Lamp, type: 'light', status: 'Off', time: '5 min ago', active: false, statusVariant: 'secondary' },
  { name: 'Bedroom Lights', location: 'Bedroom', icon: Lightbulb, type: 'light', status: 'On', time: '1 min ago', active: true, statusVariant: 'default' },
  { name: 'Front Door Lock', location: 'Entrance', icon: Lock, type: 'lock', status: 'Locked', time: '10 min ago', active: true, statusVariant: 'default' },
  { name: 'Back Door Lock', location: 'Garden', icon: Lock, type: 'lock', status: 'Unlocked', time: '15 min ago', active: false, statusVariant: 'destructive' },
  { name: 'Security Camera 1', location: 'Living Room', icon: Camera, type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { name: 'Security Camera 2', location: 'Kitchen', icon: Camera, type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { name: 'Living Room AC', location: 'Living Room', icon: AirVent, type: 'ac', status: 'Off', time: '30 min ago', active: false, statusVariant: 'secondary' },
  { name: 'Bedroom AC', location: 'Bedroom', icon: AirVent, type: 'ac', status: 'Cooling', time: '5 min ago', active: true, statusVariant: 'default' },
];

const initialRooms: Room[] = [
  {
    name: "Living Room",
    temp: 22,
    lightsOn: 1,
    lightsTotal: 2,
    devices: [
      { name: "Living Room Lights", type: "Light", icon: Lightbulb, active: true },
      { name: "Accent Lights", type: "Light", icon: Lamp, active: false },
      { name: "Security Camera 1", type: "Camera", icon: Camera, active: true },
      { name: "Living Room AC", type: "AC", icon: AirVent, active: false },
    ],
  },
  {
    name: "Kitchen",
    temp: 24,
    lightsOn: 2,
    lightsTotal: 2,
    devices: [
      { name: "Kitchen Lights", type: "Light", icon: Lightbulb, active: true },
      { name: "Under Cabinet", type: "Light", icon: Lamp, active: true },
      { name: "Security Camera 2", type: "Camera", icon: Camera, active: false },
    ],
  },
  {
    name: "Bedroom",
    temp: 20,
    lightsOn: 1,
    lightsTotal: 2,
    devices: [
      { name: "Bedroom Lights", type: "Light", icon: Lightbulb, active: false },
      { name: "Bedside Lamp", type: "Light", icon: Lamp, active: true },
      { name: "Bedroom Door Lock", type: "Door", icon: Lock, active: true },
      { name: "Bedroom AC", type: "AC", icon: AirVent, active: false },
    ],
  },
  {
    name: "Entrance",
    temp: 23,
    lightsOn: 1,
    lightsTotal: 1,
    devices: [
      { name: "Entrance Light", type: "Light", icon: Lightbulb, active: true },
      { name: "Front Door Lock", type: "Door", icon: DoorOpen, active: false },
      { name: "Doorbell Camera", type: "Camera", icon: Bell, active: false },
    ],
  },
];

const initialScenes: Scene[] = [
  { name: "Good Morning", icon: Sunrise, description: "Gradually brighten lights and start your day." },
  { name: "Movie Night", icon: Tv, description: "Dim the lights and set the mood for a movie." },
  { name: "Focus Time", icon: BrainCircuit, description: "Bright, cool lighting to help you concentrate." },
  { name: "Good Night", icon: Sunset, description: "Turn off all lights and secure the house." },
];

const initialAutomations: Automation[] = [
  { icon: Clock, name: "Morning Routine", description: "Turn on lights when motion detected after 6 AM", trigger: "Motion + Time", action: "Turn on lights", status: "Active", lastRun: "This morning", active: true, },
  { icon: Sparkles, name: "Energy Saver", description: "Turn off lights when no motion for 10 minutes", trigger: "No motion", action: "Turn off lights", status: "Active", lastRun: "2 hours ago", active: true, },
  { icon: Clock, name: "Security Mode", description: "Lock doors and arm cameras at 11 PM", trigger: "11:00 PM", action: "Lock & Arm", status: "Paused", lastRun: "Yesterday", active: false, },
  { icon: Wind, name: "Climate Control", description: "Adjust temperature based on occupancy", trigger: "Occupancy change", action: "Adjust AC", status: "Active", lastRun: "1 hour ago", active: true, },
];

// Context
const AppContext = React.createContext<AppState | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = React.useState<Device[]>(initialDevices);
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [scenes, setScenes] = React.useState<Scene[]>(initialScenes);
  const [automations, setAutomations] = React.useState<Automation[]>(initialAutomations);
  const { toast } = useToast();

  const handleDeviceToggle = (deviceName: string, roomName?: string) => {
    // Update main device list (for dashboard)
    setDevices(prevDevices => prevDevices.map(device => {
        if (device.name === deviceName) {
            const newActiveState = !device.active;
            let newStatus = device.status;
            let newStatusVariant: any = device.statusVariant;
    
            if (device.type.toLowerCase().includes('light')) {
              newStatus = newActiveState ? 'On' : 'Off';
              newStatusVariant = newActiveState ? 'default' : 'secondary';
            } else if (device.type.toLowerCase().includes('lock')) {
              newStatus = newActiveState ? 'Locked' : 'Unlocked';
              newStatusVariant = newActiveState ? 'default' : 'destructive';
            } else if (device.type.toLowerCase().includes('camera')) {
              newStatus = newActiveState ? 'Recording' : 'Off';
              newStatusVariant = newActiveState ? 'default' : 'secondary';
            } else if (device.type.toLowerCase().includes('ac')) {
              newStatus = newActiveState ? 'Cooling' : 'Off';
              newStatusVariant = newActiveState ? 'default' : 'secondary';
            }
            
            return { ...device, active: newActiveState, status: newStatus, statusVariant: newStatusVariant, time: 'Just now' };
        }
        return device;
    }));

    // Update rooms device list
    if (roomName) {
        setRooms(prevRooms => prevRooms.map(room => {
            if (room.name === roomName) {
                const newDevices = room.devices.map(device => {
                    if (device.name === deviceName) {
                        return { ...device, active: !device.active };
                    }
                    return device;
                });
                const newLightsOn = newDevices.filter(d => d.type === "Light" && d.active).length;
                return { ...room, devices: newDevices, lightsOn: newLightsOn };
            }
            return room;
        }));
    }
  };

  const handleAllLights = (roomName: string, turnOn: boolean) => {
    setRooms(prevRooms => prevRooms.map(room => {
        if (room.name === roomName) {
            const newDevices = room.devices.map(device => {
                if (device.type === "Light") {
                    return { ...device, active: turnOn };
                }
                return device;
            });
            const newLightsOn = newDevices.filter(d => d.type === "Light" && d.active).length;
            
            // Also update the main device list
            setDevices(prevDevices => prevDevices.map(d => {
                if (d.location === roomName && d.type === 'light') {
                    return {...d, active: turnOn, status: turnOn ? 'On' : 'Off', statusVariant: turnOn ? 'default' : 'secondary', time: 'Just now' };
                }
                return d;
            }));

            return { ...room, devices: newDevices, lightsOn: newLightsOn };
        }
        return room;
    }));
  };

  const handleActivateScene = (sceneName: string) => {
    toast({
      title: "Scene Activated",
      description: `The "${sceneName}" scene has been activated.`,
    });
  };

  const handleCreateScene = (name: string, description: string) => {
    const newScene = {
      name,
      description,
      icon: Lightbulb,
    };
    setScenes(prev => [...prev, newScene]);
    toast({
      title: "Scene Created",
      description: `The "${name}" scene has been created.`,
    });
  };

  const handleAutomationToggle = (automationName: string, forceState?: boolean) => {
    setAutomations(prev => prev.map(auto => {
        if (auto.name === automationName) {
          const newActiveState = forceState !== undefined ? forceState : !auto.active;
          return { ...auto, active: newActiveState, status: newActiveState ? "Active" : "Paused" };
        }
        return auto;
      })
    );
  };

  const handleCreateAutomation = (data: NewAutomationData) => {
    const newAutomation: Automation = {
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      action: data.action,
      icon: Zap,
      active: true,
      status: "Active",
      lastRun: "Never",
    };
    setAutomations((prev) => [...prev, newAutomation]);
    toast({
      title: "Automation Created",
      description: `The "${data.name}" automation has been successfully created.`,
    });
  };

  const value = {
    devices,
    rooms,
    scenes,
    automations,
    handleDeviceToggle,
    handleAllLights,
    handleActivateScene,
    handleCreateScene,
    handleAutomationToggle,
    handleCreateAutomation,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppState => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppStateProvider");
  }
  return context;
};
