"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Flame,
  Lightbulb,
  LightbulbOff,
} from "lucide-react";
import { useAppContext } from "@/context/app-state-context";

const DeviceItem = ({
  device,
  onToggle,
}: {
  device: { name: string; type: string; icon: React.ElementType; active: boolean };
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
  const { rooms, handleDeviceToggle, handleAllLights } = useAppContext();

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
                  onToggle={() => handleDeviceToggle(device.name, room.name)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
