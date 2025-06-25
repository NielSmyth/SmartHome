"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useAppContext } from "@/context/app-state-context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const automationFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  trigger: z.string().min(1, "Please select a trigger."),
  action: z.string().min(1, "Please select an action."),
});

type AutomationFormValues = z.infer<typeof automationFormSchema>;

export default function AutomationsPage() {
  const { automations, handleAutomationToggle, handleCreateAutomation } =
    useAppContext();
  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);

  const form = useForm<AutomationFormValues>({
    resolver: zodResolver(automationFormSchema),
    defaultValues: {
      name: "",
      description: "",
      trigger: "",
      action: "",
    },
  });

  const onSubmit = (data: AutomationFormValues) => {
    handleCreateAutomation(data);
    form.reset();
    setCreateDialogOpen(false);
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
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus />
              Create Automation
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Automation</DialogTitle>
              <DialogDescription>
                Set up a new rule to automate your home.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 py-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Automation Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Evening Wind Down"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe what this automation does"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trigger"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trigger" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Time of Day">
                            Time of Day
                          </SelectItem>
                          <SelectItem value="Motion Detected">
                            Motion Detected
                          </SelectItem>
                          <SelectItem value="Device State Change">
                            Device State Change
                          </SelectItem>
                          <SelectItem value="Occupancy Change">
                            Occupancy Change
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Action</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an action" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Turn on Lights">
                            Turn on Lights
                          </SelectItem>
                          <SelectItem value="Turn off Lights">
                            Turn off Lights
                          </SelectItem>
                          <SelectItem value="Adjust Thermostat">
                            Adjust Thermostat
                          </SelectItem>
                          <SelectItem value="Lock Doors">Lock Doors</SelectItem>
                          <SelectItem value="Send Notification">
                            Send Notification
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">Create Automation</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {automations.map((automation) => (
          <Card
            key={automation.id}
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
                  onCheckedChange={() => handleAutomationToggle(automation.id)}
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
