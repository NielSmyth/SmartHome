"use client";

import * as React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useAppContext } from '@/context/app-state-context';

export default function DashboardPage() {
  const { devices, handleDeviceToggle } = useAppContext();

  const sortedDevices = [...devices].sort((a, b) => a.location.localeCompare(b.location) || a.name.localeCompare(b.name));

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
        {sortedDevices.map((device) => (
          <Card key={device.id}>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <device.icon className="w-6 h-6 text-primary" />
                  <div>
                    <p className="font-semibold">{device.name}</p>
                    <p className="text-sm text-muted-foreground">{device.location}</p>
                  </div>
                </div>
                <Switch checked={device.active} onCheckedChange={() => handleDeviceToggle(device.id)} />
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
