
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import {
  AirVent, Bell, BrainCircuit, Camera, Clock, DoorOpen, Flame, Lamp, Lightbulb, Lock, Shield, Sparkles, Sunrise, Sunset, Tv, Wind, Zap
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { 
    initializeDb, db_getUsers, db_updateUserRole, db_deleteUser, db_getUserByEmail, db_updateUserLoginTime,
    db_getDevices, db_getDevice, db_updateDevice, db_createDevice, db_deleteDevice,
    db_getRoomsRaw, db_createRoom, db_updateRoom, db_deleteRoom, db_setAllLights,
    db_getScenes, db_createScene, db_updateScene, db_deleteScene,
    db_getAutomations, db_toggleAutomation, db_createAutomation, db_updateAutomation, db_deleteAutomation
} from '@/lib/database';

// Helper to map string names to actual Icon components
const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb, Lamp, Lock, Camera, AirVent, DoorOpen, Bell, Sunrise, Sunset, Tv, BrainCircuit, Clock, Sparkles, Wind, Zap, Shield
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
  iconName: string;
  description: string;
}

export interface Automation {
  id: string;
  icon: LucideIcon;
  iconName: string;
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
  handleUpdateScene: (id: string, data: { name: string; description: string }) => void;
  handleDeleteScene: (id: string) => void;

  // Automation handlers
  handleAutomationToggle: (automationId: string, forceState?: boolean) => void;
  handleCreateAutomation: (data: NewAutomationData) => void;
  handleUpdateAutomation: (id: string, data: Partial<NewAutomationData>) => void;
  handleDeleteAutomation: (id: string) => void;
  handleEmergencyShutdown: () => void;
}

// Context
const AppContext = React.createContext<AppState | undefined>(undefined);


export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = React.useState<UserProfile[]>([]);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [scenes, setScenes] = React.useState<Scene[]>([]);
  const [automations, setAutomations] = React.useState<Automation[]>([]);
  const { toast } = useToast();

  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const fetchData = React.useCallback(async () => {
    try {
        const dbUsers = await db_getUsers();
        const dbDevices = await db_getDevices();
        const dbRoomsRaw = await db_getRoomsRaw();
        const dbScenes = await db_getScenes();
        const dbAutomations = await db_getAutomations();
        
        const transformedDevices: Device[] = dbDevices.map(d => ({...d, icon: getIcon(d.iconName)}));
        
        const transformedRooms: Room[] = dbRoomsRaw.map(room => {
            const roomDevices = transformedDevices.filter(d => d.location === room.name).sort((a, b) => a.name.localeCompare(b.name));
            const lights = roomDevices.filter(d => d.type.toLowerCase().includes('light'));
            return {
                ...room,
                devices: roomDevices.map(rd => ({ name: rd.name, type: rd.type, icon: rd.icon, active: rd.active })),
                lightsOn: lights.filter(l => l.active).length,
                lightsTotal: lights.length,
            };
        });

        setUsers(dbUsers.map(u => ({...u, lastLogin: new Date(u.lastLogin).toLocaleString() })));
        setDevices(transformedDevices);
        setRooms(transformedRooms);
        setScenes(dbScenes.map(s => ({...s, icon: getIcon(s.iconName)})));
        setAutomations(dbAutomations.map(a => ({...a, icon: getIcon(a.iconName)})));
        return true;
    } catch (e) {
        console.error("Fetch data failed, likely DB not initialized.", e);
        return false;
    }
  }, []);

  React.useEffect(() => {
    async function init() {
      const success = await fetchData();
      if (!success) {
          console.log("Database not ready, initializing...");
          await initializeDb();
          console.log("Database initialized, retrying fetch.");
          await fetchData();
      }
      setIsInitialized(true);
      // Mock auth check
      setAuthLoading(false);
    }
    init();
  }, [fetchData]);


  const login = async (email: string, password: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        // In a real app, password should be hashed and checked
        const dbUser = await db_getUserByEmail(email);
        if (dbUser) {
            await db_updateUserLoginTime(dbUser.id);
            const loggedInUser = {...dbUser, lastLogin: new Date().toLocaleString()};
            setUser(loggedInUser);
            setIsAdmin(dbUser.role === 'admin');
            await fetchData(); // re-fetch data on login
            toast({ title: "Login Successful", description: `Welcome back, ${dbUser.name}!` });
            resolve();
        } else {
            reject(new Error("Invalid email or password."));
        }
    });
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
  };


  // User Handlers
  const handleUpdateUserRole = async (userId: string, role: "admin" | "user") => {
    await db_updateUserRole(userId, role);
    await fetchData();
    toast({ title: "User Role Updated" });
  };
  const handleDeleteUser = async (userId: string) => {
    await db_deleteUser(userId);
    await fetchData();
    toast({ title: "User Deleted" });
  };

  // Device Handlers
  const handleDeviceToggle = async (deviceId: string) => {
    const device = await db_getDevice(deviceId);
    if (!device) return;

    const newActiveState = !device.active;
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
    
    await db_updateDevice({ id: deviceId, active: newActiveState, status: newStatus, statusVariant: newStatusVariant, time: "Just now" });
    await fetchData();
  };

  const handleAllLights = async (roomName: string, turnOn: boolean) => {
    await db_setAllLights(roomName, turnOn);
    await fetchData();
    toast({ title: `All lights in ${roomName} turned ${turnOn ? "on" : "off"}.` });
  };

  const handleCreateDevice = async (data: NewDeviceData) => {
    await db_createDevice(data);
    await fetchData();
    toast({ title: "Device Created" });
  };

  const handleUpdateDevice = async (id: string, data: Partial<NewDeviceData>) => {
    await db_updateDevice({ id, ...data });
    await fetchData();
    toast({ title: "Device Updated" });
  };

  const handleDeleteDevice = async (id: string) => {
    await db_deleteDevice(id);
    await fetchData();
    toast({ title: "Device Deleted" });
  };
  
  // Room Handlers
  const handleCreateRoom = async (data: { name: string; temp: number }) => {
    await db_createRoom(data);
    await fetchData();
    toast({ title: "Room Created" });
  };

  const handleUpdateRoom = async (name: string, data: { name: string; temp: number }) => {
    await db_updateRoom(name, data);
    await fetchData();
    toast({ title: "Room Updated" });
  };

  const handleDeleteRoom = async (name: string) => {
    await db_deleteRoom(name);
    await fetchData();
    toast({ title: "Room Deleted" });
  };

  // Scene Handlers
  const handleActivateScene = async (sceneName: string) => {
    toast({ title: "Scene Activated", description: `The "${sceneName}" scene has been activated.` });

    const currentDevices = await db_getDevices();
    let updatePromises: Promise<any>[] = [];

    const getUpdate = (d: any, active: boolean, status: string, statusVariant: string) => ({...d, active, status, statusVariant});

    switch (sceneName) {
        case "Good Morning":
            currentDevices.forEach(d => {
                if (d.name === 'Living Room Lights' || d.name === 'Bedroom Lights') {
                    updatePromises.push(db_updateDevice(getUpdate(d, true, 'On', 'default')));
                } else if (d.name === 'Front Door Lock') {
                    updatePromises.push(db_updateDevice(getUpdate(d, false, 'Unlocked', 'destructive')));
                }
            });
            break;
        case "Movie Night":
             currentDevices.forEach(d => {
                if (d.name === 'Kitchen Lights' || d.name === 'Bedroom Lights') {
                    updatePromises.push(db_updateDevice(getUpdate(d, false, 'Off', 'secondary')));
                } else if (d.name === 'Living Room Lights') {
                    updatePromises.push(db_updateDevice(getUpdate(d, true, 'On', 'default')));
                }
            });
            break;
        case "Focus Time":
            currentDevices.forEach(d => {
                if (d.type.toLowerCase().includes('light')) {
                     updatePromises.push(db_updateDevice(getUpdate(d, true, 'On', 'default')));
                }
            });
            break;
        case "Good Night":
            currentDevices.forEach(d => {
                if (d.type.toLowerCase().includes('light')) {
                    updatePromises.push(db_updateDevice(getUpdate(d, false, 'Off', 'secondary')));
                } else if (d.type.toLowerCase().includes('lock')) {
                    updatePromises.push(db_updateDevice(getUpdate(d, true, 'Locked', 'default')));
                }
            });
            break;
    }

    await Promise.all(updatePromises);
    await fetchData();
  };

  const handleCreateScene = async (name: string, description: string) => {
    await db_createScene(name, description);
    await fetchData();
    toast({ title: "Scene Created" });
  };

  const handleUpdateScene = async (id: string, data: { name: string, description: string }) => {
    await db_updateScene(id, data);
    await fetchData();
    toast({ title: "Scene Updated" });
  };

  const handleDeleteScene = async (id: string) => {
    await db_deleteScene(id);
    await fetchData();
    toast({ title: "Scene Deleted" });
  };
  
  // Automation Handlers
  const handleAutomationToggle = async (automationId: string, forceState?: boolean) => {
    await db_toggleAutomation(automationId, forceState);
    await fetchData();
  };

  const handleCreateAutomation = async (data: NewAutomationData) => {
    await db_createAutomation(data);
    await fetchData();
    toast({ title: "Automation Created" });
  };

  const handleUpdateAutomation = async (id: string, data: Partial<NewAutomationData>) => {
    await db_updateAutomation(id, data);
    await fetchData();
    toast({ title: "Automation Updated" });
  };

  const handleDeleteAutomation = async (id: string) => {
    await db_deleteAutomation(id);
    await fetchData();
    toast({ title: "Automation Deleted" });
  };

  const handleEmergencyShutdown = async () => {
    toast({
        title: "Emergency Protocol Activated",
        description: "All lights are off, doors are locked, and cameras are active.",
        variant: "destructive",
    });

    const currentDevices = await db_getDevices();
    let updatePromises: Promise<any>[] = [];

    currentDevices.forEach(d => {
        if (d.type.toLowerCase().includes('light')) {
            updatePromises.push(db_updateDevice({ id: d.id, active: false, status: 'Off', statusVariant: 'secondary' }));
        } else if (d.type.toLowerCase().includes('lock')) {
            updatePromises.push(db_updateDevice({ id: d.id, active: true, status: 'Locked', statusVariant: 'default' }));
        } else if (d.type.toLowerCase().includes('camera')) {
            updatePromises.push(db_updateDevice({ id: d.id, active: true, status: 'Recording', statusVariant: 'default' }));
        }
    });

    await Promise.all(updatePromises);
    await fetchData();
  };

  const value: AppState = {
    users,
    devices,
    rooms,
    scenes,
    automations,
    user,
    authLoading: authLoading || !isInitialized,
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
    handleEmergencyShutdown,
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
