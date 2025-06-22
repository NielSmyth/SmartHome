"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Clock, Sun, Sunset, Users } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const automations = [
  {
    name: "Evening Wind Down",
    trigger: "Time: 10:00 PM",
    actions: "Dim lights, lower thermostat",
    active: true,
  },
  {
    name: "Morning Wake Up",
    trigger: "Time: 7:00 AM on weekdays",
    actions: "Turn on lights, raise blinds",
    active: true,
  },
  {
    name: "Away Mode",
    trigger: "When nobody is home",
    actions: "Turn off all lights, set thermostat to eco",
    active: false,
  },
  {
    name: "Sunset Lights",
    trigger: "At sunset",
    actions: "Turn on exterior lights",
    active: true,
  },
];

export default function AutomationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Automations
          </h1>
          <p className="text-muted-foreground">
            Create rules to automate your home.
          </p>
        </div>
        <Button>
          <Plus />
          Create Automation
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Automations</CardTitle>
          <CardDescription>
            Manage your automated workflows.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {automations.map((automation) => (
                <TableRow key={automation.name}>
                  <TableCell className="font-medium">
                    {automation.name}
                  </TableCell>
                  <TableCell>{automation.trigger}</TableCell>
                  <TableCell>{automation.actions}</TableCell>
                  <TableCell className="flex items-center justify-end gap-2">
                    <Switch defaultChecked={automation.active} />
                    <Badge variant={automation.active ? "default" : "secondary"}>
                      {automation.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
