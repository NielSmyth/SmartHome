"use client";

import * as React from 'react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Lightbulb, Lamp, Lock, Camera, AirVent } from "lucide-react";

const initialDevices = [
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

export default function DashboardPage() {
  const [devices, setDevices] = React.useState(initialDevices);

  const handleDeviceToggle = (deviceName: string) => {
    setDevices(devices.map(device => {
      if (device.name === deviceName) {
        const newActiveState = !device.active;
        let newStatus = device.status;
        let newStatusVariant: any = device.statusVariant;

        // Simple logic to update status based on device type
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
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here's a quick overview of your devices.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {devices.map((device) => (
          <Card key={device.name}>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <device.icon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                  </div>
                </div>
                <Switch checked={device.active} onCheckedChange={() => handleDeviceToggle(device.name)} />
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={device.statusVariant as any}>{device.status}</Badge>
                <p className="text-sm text-muted-foreground">{device.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
