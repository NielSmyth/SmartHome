
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
  Lock,
  Sparkles,
  Sunrise,
  Sunset,
  Tv,
  Wind,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

// Helper to map string names to actual Icon components
const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb,
  Lamp,
  Lock,
  Camera,
  AirVent,
  DoorOpen,
  Bell,
  Sunrise,
  Sunset,
  Tv,
  BrainCircuit,
  Clock,
  Sparkles,
  Wind,
  Zap,
};
const getIcon = (name: string): LucideIcon => iconMap[name] || Zap;

// Types
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  lastLogin: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  icon: LucideIcon;
  iconName: string;
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
  id: string;
  name: string;
  icon: LucideIcon;
  description: string;
}

export interface Automation {
  id: string;
  icon: LucideIcon;
  name: string;
  description: string;
  trigger: string;
  action: string;
  status: string;
  lastRun: string;
  active: boolean;
}

export interface NewDeviceData {
  name: string;
  location: string;
  type: string;
}

export interface NewAutomationData {
  name: string;
  description: string;
  trigger: string;
  action: string;
}

interface AppState {
  users: UserProfile[];
  devices: Device[];
  rooms: Room[];
  scenes: Scene[];
  automations: Automation[];

  // Auth state
  user: UserProfile | null;
  authLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  // User handlers
  handleUpdateUserRole: (userId: string, role: "admin" | "user") => void;
  handleDeleteUser: (userId: string) => void;

  // Device handlers
  handleDeviceToggle: (deviceId: string, roomName?: string) => void;
  handleAllLights: (roomName: string, turnOn: boolean) => void;
  handleCreateDevice: (data: NewDeviceData) => void;
  handleUpdateDevice: (id: string, data: Partial<NewDeviceData>) => void;
  handleDeleteDevice: (id: string) => void;

  // Room handlers
  handleCreateRoom: (data: { name: string; temp: number }) => void;
  handleUpdateRoom: (name: string, data: { name: string; temp: number }) => void;
  handleDeleteRoom: (name: string) => void;

  // Scene handlers
  handleActivateScene: (sceneName: string) => void;
  handleCreateScene: (name: string, description: string) => void;
  handleUpdateScene: (name: string, data: { name: string; description: string }) => void;
  handleDeleteScene: (name: string) => void;

  // Automation handlers
  handleAutomationToggle: (automationId: string, forceState?: boolean) => void;
  handleCreateAutomation: (data: NewAutomationData) => void;
  handleUpdateAutomation: (id: string, data: Partial<NewAutomationData>) => void;
  handleDeleteAutomation: (id: string) => void;
}

// Context
const AppContext = React.createContext<AppState | undefined>(undefined);

// Initial Data
const initialUsers: UserProfile[] = [
  { id: "1", name: "Admin User", email: "admin@example.com", role: "admin", lastLogin: "2 hours ago" },
  { id: "2", name: "Jane Doe", email: "jane.doe@example.com", role: "user", lastLogin: "1 day ago" },
];

const initialDevices: Device[] = [
  { id: '1', name: 'Living Room Lights', location: 'Living Room', iconName: 'Lightbulb', type: 'light', status: 'On', time: '2 min ago', active: true, statusVariant: 'default' },
  { id: '2', name: 'Kitchen Lights', location: 'Kitchen', iconName: 'Lamp', type: 'light', status: 'Off', time: '5 min ago', active: false, statusVariant: 'secondary' },
  { id: '3', name: 'Bedroom Lights', location: 'Bedroom', iconName: 'Lightbulb', type: 'light', status: 'On', time: '1 min ago', active: true, statusVariant: 'default' },
  { id: '4', name: 'Front Door Lock', location: 'Entrance', iconName: 'Lock', type: 'lock', status: 'Locked', time: '10 min ago', active: true, statusVariant: 'default' },
  { id: '5', name: 'Back Door Lock', location: 'Garden', iconName: 'Lock', type: 'lock', status: 'Unlocked', time: '15 min ago', active: false, statusVariant: 'destructive' },
  { id: '6', name: 'Security Camera 1', location: 'Living Room', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { id: '7', name: 'Security Camera 2', location: 'Kitchen', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { id: '8', name: 'Living Room AC', location: 'Living Room', iconName: 'AirVent', type: 'ac', status: 'Off', time: '30 min ago', active: false, statusVariant: 'secondary' },
  { id: '9', name: 'Bedroom AC', location: 'Bedroom', iconName: 'AirVent', type: 'ac', status: 'Cooling', time: '5 min ago', active: true, statusVariant: 'default' },
].map(d => ({ ...d, icon: getIcon(d.iconName) }));

const initialRooms: Room[] = [
    { name: "Living Room", temp: 22, lightsOn: 1, lightsTotal: 2, devices: [ { name: "Living Room Lights", type: "Light", icon: getIcon('Lightbulb'), active: true }, { name: "Accent Lights", type: "Light", icon: getIcon('Lamp'), active: false }, { name: "Security Camera 1", type: "Camera", icon: getIcon('Camera'), active: true }, { name: "Living Room AC", type: "AC", icon: getIcon('AirVent'), active: false }, ], },
    { name: "Kitchen", temp: 24, lightsOn: 2, lightsTotal: 2, devices: [ { name: "Kitchen Lights", type: "Light", icon: getIcon('Lightbulb'), active: true }, { name: "Under Cabinet", type: "Light", icon: getIcon('Lamp'), active: true }, { name: "Security Camera 2", type: "Camera", icon: getIcon('Camera'), active: false }, ], },
    { name: "Bedroom", temp: 20, lightsOn: 1, lightsTotal: 2, devices: [ { name: "Bedroom Lights", type: "Light", icon: getIcon('Lightbulb'), active: false }, { name: "Bedside Lamp", type: "Light", icon: getIcon('Lamp'), active: true }, { name: "Bedroom Door Lock", type: "Door", icon: getIcon('Lock'), active: true }, { name: "Bedroom AC", type: "AC", icon: getIcon('AirVent'), active: false }, ], },
    { name: "Entrance", temp: 23, lightsOn: 1, lightsTotal: 1, devices: [ { name: "Entrance Light", type: "Light", icon: getIcon('Lightbulb'), active: true }, { name: "Front Door Lock", type: "Door", icon: getIcon('DoorOpen'), active: false }, { name: "Doorbell Camera", type: "Camera", icon: getIcon('Bell'), active: false }, ], },
];


const initialScenes: Scene[] = [
  { id: '1', name: "Good Morning", icon: getIcon('Sunrise'), description: "Gradually brighten lights and start your day." },
  { id: '2', name: "Movie Night", icon: getIcon('Tv'), description: "Dim the lights and set the mood for a movie." },
  { id: '3', name: "Focus Time", icon: getIcon('BrainCircuit'), description: "Bright, cool lighting to help you concentrate." },
  { id: '4', name: "Good Night", icon: getIcon('Sunset'), description: "Turn off all lights and secure the house." },
];

const initialAutomations: Automation[] = [
  { id: '1', icon: getIcon('Clock'), name: "Morning Routine", description: "Turn on lights when motion detected after 6 AM", trigger: "Motion + Time", action: "Turn on lights", status: "Active", lastRun: "This morning", active: true, },
  { id: '2', icon: getIcon('Sparkles'), name: "Energy Saver", description: "Turn off lights when no motion for 10 minutes", trigger: "No motion", action: "Turn off lights", status: "Active", lastRun: "2 hours ago", active: true, },
  { id: '3', icon: getIcon('Clock'), name: "Security Mode", description: "Lock doors and arm cameras at 11 PM", trigger: "11:00 PM", action: "Lock & Arm", status: "Paused", lastRun: "Yesterday", active: false, },
  { id: '4', icon: getIcon('Wind'), name: "Climate Control", description: "Adjust temperature based on occupancy", trigger: "Occupancy change", action: "Adjust AC", status: "Active", lastRun: "1 hour ago", active: true, },
];


export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = React.useState<UserProfile[]>(initialUsers);
  const [devices, setDevices] = React.useState<Device[]>(initialDevices);
  const [rooms, setRooms] = React.useState<Room[]>(initialRooms);
  const [scenes, setScenes] = React.useState<Scene[]>(initialScenes);
  const [automations, setAutomations] = React.useState<Automation[]>(initialAutomations);
  const { toast } = useToast();

  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    // In a real app, you would check a session token. For this mock, we just stop loading.
    setAuthLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simulate network delay
            if (email === 'admin@example.com' && password === 'password') {
                const adminUser = users.find(u => u.role === 'admin');
                if (adminUser) {
                    setUser(adminUser);
                    setIsAdmin(true);
                    toast({ title: "Login Successful", description: "Welcome back, Admin!" });
                    resolve();
                } else {
                    reject(new Error("Admin user not found in initial data."));
                }
            } else if (email === 'jane.doe@example.com' && password === 'password') {
                const standardUser = users.find(u => u.email === 'jane.doe@example.com');
                if (standardUser) {
                    setUser(standardUser);
                    setIsAdmin(false);
                    toast({ title: "Login Successful", description: `Welcome back, ${standardUser.name}!` });
                    resolve();
                } else {
                     reject(new Error("User not found in initial data."));
                }
            } else {
                reject(new Error("Invalid email or password."));
            }
        }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };


  // User Handlers
  const handleUpdateUserRole = (userId: string, role: "admin" | "user") => {
    setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, role } : user)));
    toast({ title: "User Role Updated" });
  };
  const handleDeleteUser = (userId: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
    toast({ title: "User Deleted" });
  };

  // Device Handlers
  const handleDeviceToggle = (deviceId: string, roomName?: string) => {
    let toggledDeviceName = "";
    let toggledDeviceType = "";
    let newActiveState: boolean | undefined;
  
    setDevices((prevDevices) =>
      prevDevices.map((device) => {
        if (device.id === deviceId) {
          newActiveState = !device.active;
          toggledDeviceName = device.name;
          toggledDeviceType = device.type;
          let newStatus = device.status;
          let newStatusVariant: any = device.statusVariant;
  
          if (device.type.toLowerCase().includes("light")) {
            newStatus = newActiveState ? "On" : "Off";
            newStatusVariant = newActiveState ? "default" : "secondary";
          } else if (device.type.toLowerCase().includes("lock")) {
            newStatus = newActiveState ? "Locked" : "Unlocked";
            newStatusVariant = newActiveState ? "default" : "destructive";
          } else if (device.type.toLowerCase().includes("camera")) {
            newStatus = newActiveState ? "Recording" : "Off";
            newStatusVariant = newActiveState ? "default" : "secondary";
          } else if (device.type.toLowerCase().includes("ac")) {
            newStatus = newActiveState ? "Cooling" : "Off";
            newStatusVariant = newActiveState ? "default" : "secondary";
          }
  
          return { ...device, active: newActiveState, status: newStatus, statusVariant: newStatusVariant, time: "Just now" };
        }
        return device;
      })
    );
  
    if (roomName && toggledDeviceName && typeof newActiveState !== 'undefined') {
      setRooms(prevRooms => prevRooms.map(room => {
        if (room.name === roomName) {
          let lightsOnDelta = 0;
          const updatedRoomDevices = room.devices.map(rd => {
            if (rd.name === toggledDeviceName) {
              if (toggledDeviceType.toLowerCase().includes('light')) {
                lightsOnDelta = newActiveState ? 1 : -1;
              }
              return { ...rd, active: newActiveState! };
            }
            return rd;
          });
          const newLightsOn = Math.max(0, room.lightsOn + lightsOnDelta);
          return { ...room, devices: updatedRoomDevices, lightsOn: newLightsOn };
        }
        return room;
      }));
    }
  };

  const handleAllLights = (roomName: string, turnOn: boolean) => {
    toast({ title: `All lights in ${roomName} turned ${turnOn ? "on" : "off"}.` });
    
    setDevices(prevDevices => prevDevices.map(d => {
        if (d.location === roomName && d.type.toLowerCase().includes('light')) {
            return {
                ...d,
                active: turnOn,
                status: turnOn ? 'On' : 'Off',
                statusVariant: turnOn ? 'default' : 'secondary',
            };
        }
        return d;
    }));

    setRooms(prevRooms => prevRooms.map(room => {
        if (room.name === roomName) {
            const updatedRoomDevices = room.devices.map(rd => {
                if (rd.type.toLowerCase().includes('light')) {
                    return { ...rd, active: turnOn };
                }
                return rd;
            });
            const newLightsOn = turnOn ? room.lightsTotal : 0;
            return { ...room, devices: updatedRoomDevices, lightsOn: newLightsOn };
        }
        return room;
    }));
  };

  const handleCreateDevice = (data: NewDeviceData) => {
    const newDevice: Device = {
        ...data,
        id: crypto.randomUUID(),
        active: false,
        status: "Off",
        statusVariant: "secondary",
        time: 'Just now',
        iconName: data.type,
        icon: getIcon(data.type),
    };
    setDevices(prev => [...prev, newDevice]);
    toast({ title: "Device Created" });
  };

  const handleUpdateDevice = (id: string, data: Partial<NewDeviceData>) => {
    setDevices(prev => prev.map(d => d.id === id ? { ...d, ...data, icon: getIcon(data.type || d.type) } as Device : d));
    toast({ title: "Device Updated" });
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
    toast({ title: "Device Deleted" });
  };
  
  // Room Handlers
  const handleCreateRoom = (data: { name: string; temp: number }) => {
    const newRoom: Room = {
        ...data,
        lightsOn: 0,
        lightsTotal: 0,
        devices: [],
    };
    setRooms(prev => [...prev, newRoom]);
    toast({ title: "Room Created" });
  };

  const handleUpdateRoom = (name: string, data: { name: string; temp: number }) => {
    setRooms(prev => prev.map(r => r.name === name ? {...r, ...data} : r));
    toast({ title: "Room Updated" });
  };

  const handleDeleteRoom = (name: string) => {
    setRooms(prev => prev.filter(r => r.name !== name));
    toast({ title: "Room Deleted" });
  };

  // Scene Handlers
  const handleActivateScene = (sceneName: string) => {
    toast({ title: "Scene Activated", description: `The "${sceneName}" scene has been activated.` });

    let updatedDevices = [...devices]; 

    switch (sceneName) {
        case "Good Morning":
            updatedDevices = updatedDevices.map(d => {
                if (d.name === 'Living Room Lights' || d.name === 'Bedroom Lights') {
                    return { ...d, active: true, status: 'On', statusVariant: 'default' };
                }
                if (d.name === 'Front Door Lock') {
                    return { ...d, active: false, status: 'Unlocked', statusVariant: 'destructive' };
                }
                return d;
            });
            break;
        
        case "Movie Night":
            updatedDevices = updatedDevices.map(d => {
                if (d.name === 'Kitchen Lights' || d.name === 'Bedroom Lights') {
                    return { ...d, active: false, status: 'Off', statusVariant: 'secondary' };
                }
                if (d.name === 'Living Room Lights') {
                    return { ...d, active: true, status: 'On', statusVariant: 'default' };
                }
                return d;
            });
            break;

        case "Focus Time":
            updatedDevices = updatedDevices.map(d => {
                if (d.type.toLowerCase().includes('light')) {
                    return { ...d, active: true, status: 'On', statusVariant: 'default' };
                }
                return d;
            });
            break;

        case "Good Night":
            updatedDevices = updatedDevices.map(d => {
                if (d.type.toLowerCase().includes('light')) {
                    return { ...d, active: false, status: 'Off', statusVariant: 'secondary' };
                }
                if (d.type.toLowerCase().includes('lock')) {
                    return { ...d, active: true, status: 'Locked', statusVariant: 'default' };
                }
                return d;
            });
            break;
        
        default:
            break;
    }

    setDevices(updatedDevices);

    setRooms(prevRooms => {
        return prevRooms.map(room => {
            let newLightsOn = 0;
            const updatedRoomDevices = room.devices.map(rd => {
                const mainDevice = updatedDevices.find(d => d.name === rd.name);
                if (mainDevice) {
                    if (mainDevice.type.toLowerCase().includes('light') && mainDevice.active) {
                        newLightsOn++;
                    }
                    return { ...rd, active: mainDevice.active };
                }
                return rd;
            });

            return { ...room, devices: updatedRoomDevices, lightsOn: newLightsOn };
        });
    });
  };

  const handleCreateScene = (name: string, description: string) => {
    const newScene: Scene = {
      id: crypto.randomUUID(),
      name,
      description,
      icon: getIcon("Sparkles"),
    };
    setScenes((prev) => [...prev, newScene]);
    toast({ title: "Scene Created" });
  };

  const handleUpdateScene = (id: string, data: { name: string, description: string }) => {
    setScenes(prev => prev.map(s => s.id === id ? {...s, ...data} : s));
    toast({ title: "Scene Updated" });
  };

  const handleDeleteScene = (id: string) => {
    setScenes(prev => prev.filter(s => s.id !== id));
    toast({ title: "Scene Deleted" });
  };
  
  // Automation Handlers
  const handleAutomationToggle = (automationId: string, forceState?: boolean) => {
    setAutomations((prev) =>
      prev.map((auto) => {
        if (auto.id === automationId) {
          const newActiveState = forceState !== undefined ? forceState : !auto.active;
          return { ...auto, active: newActiveState, status: newActiveState ? "Active" : "Paused" };
        }
        return auto;
      })
    );
  };

  const handleCreateAutomation = (data: NewAutomationData) => {
    const newAutomation: Automation = {
        id: crypto.randomUUID(),
        ...data,
        icon: getIcon('Zap'),
        active: true,
        status: "Active",
        lastRun: "Never",
    };
    setAutomations(prev => [...prev, newAutomation]);
    toast({ title: "Automation Created" });
  };

  const handleUpdateAutomation = (id: string, data: Partial<NewAutomationData>) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
    toast({ title: "Automation Updated" });
  };

  const handleDeleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    toast({ title: "Automation Deleted" });
  };

  const value: AppState = {
    users,
    devices,
    rooms,
    scenes,
    automations,
    user,
    authLoading,
    isAdmin,
    login,
    logout,
    handleUpdateUserRole,
    handleDeleteUser,
    handleDeviceToggle,
    handleAllLights,
    handleCreateDevice,
    handleUpdateDevice,
    handleDeleteDevice,
    handleCreateRoom,
    handleUpdateRoom,
    handleDeleteRoom,
    handleActivateScene,
    handleCreateScene,
    handleUpdateScene,
    handleDeleteScene,
    handleAutomationToggle,
    handleCreateAutomation,
    handleUpdateAutomation,
    handleDeleteAutomation,
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
