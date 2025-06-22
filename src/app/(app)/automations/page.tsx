"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock, Plus, Sparkles, Wind } from "lucide-react";

const initialAutomations = [
  {
    icon: Clock,
    name: "Morning Routine",
    description: "Turn on lights when motion detected after 6 AM",
    trigger: "Motion + Time",
    action: "Turn on lights",
    status: "Active",
    lastRun: "This morning",
    active: true,
  },
  {
    icon: Sparkles,
    name: "Energy Saver",
    description: "Turn off lights when no motion for 10 minutes",
    trigger: "No motion",
    action: "Turn off lights",
    status: "Active",
    lastRun: "2 hours ago",
    active: true,
  },
  {
    icon: Clock,
    name: "Security Mode",
    description: "Lock doors and arm cameras at 11 PM",
    trigger: "11:00 PM",
    action: "Lock & Arm",
    status: "Paused",
    lastRun: "Yesterday",
    active: false,
  },
  {
    icon: Wind,
    name: "Climate Control",
    description: "Adjust temperature based on occupancy",
    trigger: "Occupancy change",
    action: "Adjust AC",
    status: "Active",
    lastRun: "1 hour ago",
    active: true,
  },
];

export default function AutomationsPage() {
  const [automations, setAutomations] = React.useState(initialAutomations);

  const handleAutomationToggle = (automationName: string) => {
    setAutomations(
      automations.map((auto) => {
        if (auto.name === automationName) {
          const newActiveState = !auto.active;
          return {
            ...auto,
            active: newActiveState,
            status: newActiveState ? "Active" : "Paused",
          };
        }
        return auto;
      })
    );
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Automation Rules
          </h1>
          <p className="text-muted-foreground">
            Manage your smart home automation triggers.
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create Automation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Automation</DialogTitle>
              <DialogDescription>
                This feature is coming soon! You'll be able to create custom
                automations here.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {automations.map((automation) => (
          <Card
            key={automation.name}
            className="flex flex-col justify-between p-6"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <automation.icon className="w-6 h-6 text-primary" />
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">{automation.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {automation.description}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={automation.active}
                  onCheckedChange={() => handleAutomationToggle(automation.name)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="text-sm text-muted-foreground">Trigger</h3>
                  <p className="font-medium">{automation.trigger}</p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground">Action</h3>
                  <p className="font-medium">{automation.action}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-6">
              <Badge
                variant={
                  automation.status.toLowerCase() === "paused"
                    ? "secondary"
                    : "default"
                }
              >
                {automation.status}
              </Badge>
              <p className="text-sm text-muted-foreground">
                Last: {automation.lastRun}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
