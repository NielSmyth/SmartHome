"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Flame,
  Lightbulb,
  Camera,
  Lock,
  AirVent,
  Lamp,
  DoorOpen,
  Bell,
  LightbulbOff,
} from "lucide-react";

const rooms = [
  {
    name: "Living Room",
    temp: 22,
    lightsOn: 1,
    lightsTotal: 2,
    devices: [
      { name: "Main Lights", type: "Light", icon: Lightbulb, active: true },
      { name: "Accent Lights", type: "Light", icon: Lamp, active: false },
      { name: "Security Camera", type: "Camera", icon: Camera, active: true },
      { name: "AC Unit", type: "AC", icon: AirVent, active: false },
    ],
  },
  {
    name: "Kitchen",
    temp: 24,
    lightsOn: 2,
    lightsTotal: 2,
    devices: [
      { name: "Ceiling Lights", type: "Light", icon: Lightbulb, active: true },
      { name: "Under Cabinet", type: "Light", icon: Lamp, active: true },
      { name: "Kitchen Camera", type: "Camera", icon: Camera, active: false },
    ],
  },
  {
    name: "Bedroom",
    temp: 20,
    lightsOn: 1,
    lightsTotal: 2,
    devices: [
      { name: "Main Light", type: "Light", icon: Lightbulb, active: false },
      { name: "Bedside Lamp", type: "Light", icon: Lamp, active: true },
      { name: "Door Lock", type: "Door", icon: Lock, active: true },
      { name: "AC Unit", type: "AC", icon: AirVent, active: false },
    ],
  },
  {
    name: "Entrance",
    temp: 23,
    lightsOn: 1,
    lightsTotal: 1,
    devices: [
      { name: "Entrance Light", type: "Light", icon: Lightbulb, active: true },
      { name: "Front Door", type: "Door", icon: DoorOpen, active: false },
      { name: "Doorbell Camera", type: "Camera", icon: Bell, active: false },
    ],
  },
];

const DeviceItem = ({ device }: { device: (typeof rooms)[0]['devices'][0] }) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
    <div className="flex items-center gap-3">
      <device.icon className="w-5 h-5 text-primary" />
      <div>
        <p className="font-semibold">{device.name}</p>
        <p className="text-xs text-muted-foreground">{device.type}</p>
      </div>
    </div>
    <Switch defaultChecked={device.active} />
  </div>
);

export default function RoomsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Rooms</h1>
        <p className="text-muted-foreground">
          Manage the devices in each of your rooms.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        {rooms.map((room) => (
          <div key={room.name} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">{room.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flame className="w-5 h-5" />
                  <span>{room.temp}°C</span>
                </div>
                <Badge variant="secondary">{`${room.lightsOn}/${room.lightsTotal} lights on`}</Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Lightbulb />
                  All Lights On
                </Button>
                <Button variant="outline" size="sm">
                  <LightbulbOff />
                  All Lights Off
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {room.devices.map((device) => (
                <DeviceItem key={device.name} device={device} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
