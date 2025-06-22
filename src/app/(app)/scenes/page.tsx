"use client";

import * as React from "react";
import {
  BrainCircuit,
  Lightbulb,
  Plus,
} from "lucide-react";
import {
  suggestScenes,
  SuggestedScenesOutput,
} from "@/ai/flows/suggested-scenes";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppContext } from "@/context/app-state-context";

const pastActions = [
  "User turned on living room lights at 8:00 AM.",
  "User dimmed bedroom lights to 30% at 10:00 PM.",
  "User set thermostat to 72°F in the evening.",
  "User turned off all lights when leaving the house.",
];

export default function ScenesPage() {
  const { scenes, handleActivateScene, handleCreateScene } = useAppContext();
  const [suggestedScenes, setSuggestedScenes] =
    React.useState<SuggestedScenesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const [isCreateDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [newSceneName, setNewSceneName] = React.useState("");
  const [newSceneDescription, setNewSceneDescription] = React.useState("");

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

  const onCreateScene = () => {
    if (!newSceneName || !newSceneDescription) {
      toast({
        title: "Error",
        description: "Please provide a name and description for the scene.",
        variant: "destructive",
      });
      return;
    }
    handleCreateScene(newSceneName, newSceneDescription);
    setCreateDialogOpen(false);
    setNewSceneName("");
    setNewSceneDescription("");
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus />
                Create Scene
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Scene</DialogTitle>
                <DialogDescription>
                  Configure a new scene to control multiple devices at once.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newSceneName}
                    onChange={(e) => setNewSceneName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={newSceneDescription}
                    onChange={(e) => setNewSceneDescription(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" onClick={onCreateScene}>
                  Create Scene
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
              <Button
                className="w-full"
                onClick={() => handleActivateScene(scene.name)}
              >
                Activate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
