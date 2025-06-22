"use client";

import * as React from "react";
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

const initialRooms = [
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

const DeviceItem = ({
  device,
  onToggle,
}: {
  device: (typeof initialRooms)[0]["devices"][0];
  onToggle: () => void;
}) => (
  <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
    <div className="flex items-center gap-3">
      <device.icon className="w-5 h-5 text-primary" />
      <div>
        <p className="font-semibold">{device.name}</p>
        <p className="text-xs text-muted-foreground">{device.type}</p>
      </div>
    </div>
    <Switch checked={device.active} onCheckedChange={onToggle} />
  </div>
);

export default function RoomsPage() {
  const [rooms, setRooms] = React.useState(initialRooms);

  const handleDeviceToggle = (roomName: string, deviceName: string) => {
    setRooms(
      rooms.map((room) => {
        if (room.name === roomName) {
          const newDevices = room.devices.map((device) => {
            if (device.name === deviceName) {
              return { ...device, active: !device.active };
            }
            return device;
          });

          const newLightsOn = newDevices.filter(
            (d) => d.type === "Light" && d.active
          ).length;

          return { ...room, devices: newDevices, lightsOn: newLightsOn };
        }
        return room;
      })
    );
  };

  const handleAllLights = (roomName: string, turnOn: boolean) => {
    setRooms(
      rooms.map((room) => {
        if (room.name === roomName) {
          const newDevices = room.devices.map((device) => {
            if (device.type === "Light") {
              return { ...device, active: turnOn };
            }
            return device;
          });

          const newLightsOn = newDevices.filter(
            (d) => d.type === "Light" && d.active
          ).length;
          return { ...room, devices: newDevices, lightsOn: newLightsOn };
        }
        return room;
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Rooms
        </h1>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAllLights(room.name, true)}
                >
                  <Lightbulb />
                  All Lights On
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAllLights(room.name, false)}
                >
                  <LightbulbOff />
                  All Lights Off
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {room.devices.map((device) => (
                <DeviceItem
                  key={device.name}
                  device={device}
                  onToggle={() => handleDeviceToggle(room.name, device.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
