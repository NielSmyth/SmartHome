
"use client";

import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  getDocs,
  writeBatch,
  deleteDoc,
} from "firebase/firestore";
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
  id: string;
  name: string;
  location: string;
  iconName: string;
  type: string;
  status: string;
  time: string;
  active: boolean;
  statusVariant: "default" | "secondary" | "destructive";
}

export interface RoomDevice {
  id: string;
  name: string;
  type: string;
  iconName: string;
  active: boolean;
}

export interface Room {
  id: string;
  name: string;
  temp: number;
  lightsOn: number;
  lightsTotal: number;
  devices: RoomDevice[];
}

export interface Scene {
  id: string;
  name: string;
  iconName: string;
  description: string;
}

export interface Automation {
  id: string;
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
  iconName: string;
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
  handleDeviceToggle: (deviceId: string, roomName?: string) => void;
  handleAllLights: (roomName: string, turnOn: boolean) => void;
  handleActivateScene: (sceneName: string) => void;
  handleCreateScene: (name: string, description: string) => void;
  handleAutomationToggle: (automationId: string, forceState?: boolean) => void;
  handleCreateAutomation: (data: NewAutomationData) => void;
  handleUpdateAutomation: (id: string, data: Partial<NewAutomationData>) => void;
  handleDeleteAutomation: (id: string) => void;
  handleCreateDevice: (data: NewDeviceData) => void;
  handleUpdateDevice: (id: string, data: Partial<NewDeviceData>) => void;
  handleDeleteDevice: (id: string) => void;
  isAdmin: boolean;
  login: (role: 'user' | 'admin') => void;
  logout: () => void;
}

// Icon Map
const iconMap: { [key: string]: LucideIcon } = {
  Lightbulb, Lamp, Lock, Camera, AirVent, Flame, DoorOpen, Bell,
  Sunrise, Tv, BrainCircuit, Sunset, Clock, Sparkles, Wind, Zap,
  LightbulbOff,
};

const getIcon = (name: string): LucideIcon => {
    return iconMap[name] || Lightbulb;
};

// Context
const AppContext = React.createContext<AppState | undefined>(undefined);

// Initial Data for Seeding
const initialDevices = [
  { name: 'Living Room Lights', location: 'Living Room', iconName: 'Lightbulb', type: 'light', status: 'On', time: '2 min ago', active: true, statusVariant: 'default' },
  { name: 'Kitchen Lights', location: 'Kitchen', iconName: 'Lamp', type: 'light', status: 'Off', time: '5 min ago', active: false, statusVariant: 'secondary' },
  { name: 'Bedroom Lights', location: 'Bedroom', iconName: 'Lightbulb', type: 'light', status: 'On', time: '1 min ago', active: true, statusVariant: 'default' },
  { name: 'Front Door Lock', location: 'Entrance', iconName: 'Lock', type: 'lock', status: 'Locked', time: '10 min ago', active: true, statusVariant: 'default' },
  { name: 'Back Door Lock', location: 'Garden', iconName: 'Lock', type: 'lock', status: 'Unlocked', time: '15 min ago', active: false, statusVariant: 'destructive' },
  { name: 'Security Camera 1', location: 'Living Room', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { name: 'Security Camera 2', location: 'Kitchen', iconName: 'Camera', type: 'camera', status: 'Recording', time: 'Just now', active: true, statusVariant: 'default' },
  { name: 'Living Room AC', location: 'Living Room', iconName: 'AirVent', type: 'ac', status: 'Off', time: '30 min ago', active: false, statusVariant: 'secondary' },
  { name: 'Bedroom AC', location: 'Bedroom', iconName: 'AirVent', type: 'ac', status: 'Cooling', time: '5 min ago', active: true, statusVariant: 'default' },
];

const initialRooms = [
  { name: "Living Room", temp: 22, lightsOn: 1, lightsTotal: 2, devices: [ { name: "Living Room Lights", type: "Light", iconName: 'Lightbulb', active: true }, { name: "Accent Lights", type: "Light", iconName: 'Lamp', active: false }, { name: "Security Camera 1", type: "Camera", iconName: 'Camera', active: true }, { name: "Living Room AC", type: "AC", iconName: 'AirVent', active: false }, ], },
  { name: "Kitchen", temp: 24, lightsOn: 2, lightsTotal: 2, devices: [ { name: "Kitchen Lights", type: "Light", iconName: 'Lightbulb', active: true }, { name: "Under Cabinet", type: "Light", iconName: 'Lamp', active: true }, { name: "Security Camera 2", type: "Camera", iconName: 'Camera', active: false }, ], },
  { name: "Bedroom", temp: 20, lightsOn: 1, lightsTotal: 2, devices: [ { name: "Bedroom Lights", type: "Light", iconName: 'Lightbulb', active: false }, { name: "Bedside Lamp", type: "Light", iconName: 'Lamp', active: true }, { name: "Bedroom Door Lock", type: "Door", iconName: 'Lock', active: true }, { name: "Bedroom AC", type: "AC", iconName: 'AirVent', active: false }, ], },
  { name: "Entrance", temp: 23, lightsOn: 1, lightsTotal: 1, devices: [ { name: "Entrance Light", type: "Light", iconName: 'Lightbulb', active: true }, { name: "Front Door Lock", type: "Door", iconName: 'DoorOpen', active: false }, { name: "Doorbell Camera", type: "Camera", iconName: 'Bell', active: false }, ], },
];

const initialScenes = [
  { name: "Good Morning", iconName: 'Sunrise', description: "Gradually brighten lights and start your day." },
  { name: "Movie Night", iconName: 'Tv', description: "Dim the lights and set the mood for a movie." },
  { name: "Focus Time", iconName: 'BrainCircuit', description: "Bright, cool lighting to help you concentrate." },
  { name: "Good Night", iconName: 'Sunset', description: "Turn off all lights and secure the house." },
];

const initialAutomations = [
  { iconName: 'Clock', name: "Morning Routine", description: "Turn on lights when motion detected after 6 AM", trigger: "Motion + Time", action: "Turn on lights", status: "Active", lastRun: "This morning", active: true, },
  { iconName: 'Sparkles', name: "Energy Saver", description: "Turn off lights when no motion for 10 minutes", trigger: "No motion", action: "Turn off lights", status: "Active", lastRun: "2 hours ago", active: true, },
  { iconName: 'Clock', name: "Security Mode", description: "Lock doors and arm cameras at 11 PM", trigger: "11:00 PM", action: "Lock & Arm", status: "Paused", lastRun: "Yesterday", active: false, },
  { iconName: 'Wind', name: "Climate Control", description: "Adjust temperature based on occupancy", trigger: "Occupancy change", action: "Adjust AC", status: "Active", lastRun: "1 hour ago", active: true, },
];


export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [rooms, setRooms] = React.useState<Room[]>([]);
  const [scenes, setScenes] = React.useState<Scene[]>([]);
  const [automations, setAutomations] = React.useState<Automation[]>([]);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const { toast } = useToast();

  React.useEffect(() => {
    const seedDatabase = async () => {
      try {
        const collections = ['devices', 'rooms', 'scenes', 'automations'];
        let shouldSeed = false;

        for (const coll of collections) {
          const snapshot = await getDocs(collection(db, coll));
          if (snapshot.empty) {
            shouldSeed = true;
            break;
          }
        }
        
        if (shouldSeed) {
          console.log("Empty database detected, seeding with initial data...");
          const batch = writeBatch(db);
          
          initialDevices.forEach(item => batch.set(doc(collection(db, "devices")), item));
          initialRooms.forEach(item => batch.set(doc(collection(db, "rooms")), item));
          initialScenes.forEach(item => batch.set(doc(collection(db, "scenes")), item));
          initialAutomations.forEach(item => batch.set(doc(collection(db, "automations")), item));

          await batch.commit();
          toast({ title: "Database seeded", description: "Initial data has been loaded." });
        }
      } catch (error) {
        console.error("Error seeding database:", error);
        toast({ title: "Error", description: "Could not seed the database.", variant: "destructive" });
      }
    };
    seedDatabase();

    const unsubDevices = onSnapshot(collection(db, "devices"), (snapshot) => {
      setDevices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Device)));
    });
    const unsubRooms = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Room)));
    });
    const unsubScenes = onSnapshot(collection(db, "scenes"), (snapshot) => {
      setScenes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Scene)));
    });
    const unsubAutomations = onSnapshot(collection(db, "automations"), (snapshot) => {
      setAutomations(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Automation)));
    });

    return () => {
      unsubDevices();
      unsubRooms();
      unsubScenes();
      unsubAutomations();
    };
  }, [toast]);

  const handleDeviceToggle = async (deviceId: string) => {
    const deviceRef = doc(db, "devices", deviceId);
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

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
    
    await updateDoc(deviceRef, { active: newActiveState, status: newStatus, statusVariant: newStatusVariant, time: 'Just now' });
  };
  
  const handleAllLights = (roomName: string, turnOn: boolean) => {
    console.log(`Toggling all lights in ${roomName} to ${turnOn}`);
    toast({
      title: "Action in progress",
      description: `Turning all lights in ${roomName} ${turnOn ? 'on' : 'off'}.`
    })
  };

  const handleActivateScene = (sceneName: string) => {
    toast({
      title: "Scene Activated",
      description: `The "${sceneName}" scene has been activated.`,
    });
  };

  const handleCreateScene = async (name: string, description: string) => {
    const newScene = {
      name,
      description,
      iconName: "Lightbulb",
    };
    await addDoc(collection(db, "scenes"), newScene);
    toast({
      title: "Scene Created",
      description: `The "${name}" scene has been created.`,
    });
  };

  const handleAutomationToggle = async (automationId: string, forceState?: boolean) => {
    const autoRef = doc(db, "automations", automationId);
    const auto = automations.find(a => a.id === automationId);
    if (!auto) return;

    const newActiveState = forceState !== undefined ? forceState : !auto.active;
    await updateDoc(autoRef, { active: newActiveState, status: newActiveState ? "Active" : "Paused" });
  };

  const handleCreateAutomation = async (data: NewAutomationData) => {
    const newAutomation = {
      ...data,
      iconName: 'Zap',
      active: true,
      status: "Active",
      lastRun: "Never",
    };
    await addDoc(collection(db, "automations"), newAutomation);
    toast({
      title: "Automation Created",
      description: `The "${data.name}" automation has been successfully created.`,
    });
  };

  const handleUpdateAutomation = async (id: string, data: Partial<NewAutomationData>) => {
    await updateDoc(doc(db, "automations", id), data);
    toast({
        title: "Automation Updated",
        description: `The automation has been updated.`,
    });
  };

  const handleDeleteAutomation = async (id: string) => {
    await deleteDoc(doc(db, "automations", id));
    toast({
        title: "Automation Deleted",
        description: "The automation has been removed from the system.",
    });
  };

  const handleCreateDevice = async (data: NewDeviceData) => {
    const newDevice = {
        ...data,
        active: false,
        status: 'Off',
        statusVariant: 'secondary',
        time: 'Just now',
    };
    await addDoc(collection(db, "devices"), newDevice);
    toast({
        title: "Device Created",
        description: `The "${data.name}" device has been added.`,
    });
  };

  const handleUpdateDevice = async (id: string, data: Partial<NewDeviceData>) => {
      await updateDoc(doc(db, "devices", id), data);
      toast({
          title: "Device Updated",
          description: `The device has been updated.`,
      });
  };

  const handleDeleteDevice = async (id: string) => {
      await deleteDoc(doc(db, "devices", id));
      toast({
          title: "Device Deleted",
          description: "The device has been removed from the system.",
      });
  };

  const login = (role: 'user' | 'admin') => {
    setIsAdmin(role === 'admin');
  };

  const logout = () => {
    setIsAdmin(false);
  };

  // Replace icon names with actual components before rendering
  const enrichedDevices = devices.map(d => ({ ...d, icon: getIcon(d.iconName) }));
  const enrichedRooms = rooms.map(r => ({ ...r, devices: r.devices.map(d => ({...d, icon: getIcon(d.iconName)})) }));
  const enrichedScenes = scenes.map(s => ({ ...s, icon: getIcon(s.iconName) }));
  const enrichedAutomations = automations.map(a => ({ ...a, icon: getIcon(a.iconName) }));

  const value = {
    devices: enrichedDevices,
    rooms: enrichedRooms,
    scenes: enrichedScenes,
    automations: enrichedAutomations,
    handleDeviceToggle,
    handleAllLights,
    handleActivateScene,
    handleCreateScene,
    handleAutomationToggle,
    handleCreateAutomation,
    handleUpdateAutomation,
    handleDeleteAutomation,
    handleCreateDevice,
    handleUpdateDevice,
    handleDeleteDevice,
    isAdmin,
    login,
    logout,
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
