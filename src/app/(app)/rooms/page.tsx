"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Flame, Lightbulb, Snowflake } from "lucide-react";

const rooms = [
  { name: "Living Room", lights: true, temp: 22 },
  { name: "Bedroom", lights: false, temp: 20 },
  { name: "Kitchen", lights: true, temp: 21 },
  { name: "Office", lights: true, temp: 23 },
];

export default function RoomsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Rooms</h1>
        <p className="text-muted-foreground">
          Manage the devices in each of your rooms.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room.name}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
              <CardDescription>Control lights and climate.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor={`lights-${room.name}`} className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  <span>Lights</span>
                </Label>
                <Switch id={`lights-${room.name}`} defaultChecked={room.lights} />
              </div>
              <div className="space-y-3">
                 <Label htmlFor={`temp-${room.name}`} className="flex items-center justify-between">
                   <span className="flex items-center gap-2">
                    <Flame className="w-5 h-5" />
                    <span>Temperature</span>
                   </span>
                   <span className="font-medium">{room.temp}°C</span>
                </Label>
                <div className="flex items-center gap-4">
                    <Snowflake className="text-muted-foreground" />
                    <Slider
                    id={`temp-${room.name}`}
                    defaultValue={[room.temp]}
                    min={15}
                    max={30}
                    step={1}
                    />
                    <Flame className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
