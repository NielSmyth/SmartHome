"use client";

import * as React from "react";
import {
  BrainCircuit,
  Lightbulb,
  Plus,
  Sunrise,
  Sunset,
  Tv,
} from "lucide-react";
import { suggestScenes, SuggestedScenesOutput } from "@/ai/flows/suggested-scenes";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const scenes = [
  {
    name: "Good Morning",
    icon: Sunrise,
    description: "Gradually brighten lights and start your day.",
  },
  {
    name: "Movie Night",
    icon: Tv,
    description: "Dim the lights and set the mood for a movie.",
  },
  {
    name: "Focus Time",
    icon: BrainCircuit,
    description: "Bright, cool lighting to help you concentrate.",
  },
  {
    name: "Good Night",
    icon: Sunset,
    description: "Turn off all lights and secure the house.",
  },
];

const pastActions = [
  "User turned on living room lights at 8:00 AM.",
  "User dimmed bedroom lights to 30% at 10:00 PM.",
  "User set thermostat to 72°F in the evening.",
  "User turned off all lights when leaving the house.",
];

export default function ScenesPage() {
  const [suggestedScenes, setSuggestedScenes] = React.useState<SuggestedScenesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleSuggestScenes = async () => {
    setIsLoading(true);
    setSuggestedScenes(null);
    try {
      const result = await suggestScenes({ pastActions });
      setSuggestedScenes(result);
    } catch (error) {
      console.error("Error suggesting scenes:", error);
      toast({
        title: "Error",
        description: "Could not suggest new scenes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">
            Scenes
          </h1>
          <p className="text-muted-foreground">
            Control groups of devices with a single tap.
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={handleSuggestScenes}>
                <BrainCircuit />
                Suggest Scenes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>AI-Powered Suggestions</DialogTitle>
                <DialogDescription>
                  Based on your recent activity, here are a few scenes you might
                  find useful.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                {isLoading && (
                  <>
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                  </>
                )}
                {suggestedScenes?.suggestedScenes.map((scene, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-center justify-between p-4">
                      <p className="font-medium">{scene}</p>
                      <Button size="icon" variant="ghost">
                        <Plus />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button>
            <Plus />
            Create Scene
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {scenes.map((scene) => (
          <Card key={scene.name} className="flex flex-col">
            <CardHeader className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl">{scene.name}</CardTitle>
                  <CardDescription>{scene.description}</CardDescription>
                </div>
                <scene.icon className="w-6 h-6 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Activate</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
