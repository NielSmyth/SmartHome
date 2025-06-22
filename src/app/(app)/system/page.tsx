"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Loader,
  Server,
  Thermometer,
  Wifi,
  Zap,
} from "lucide-react";

import { analyzeSystemStatus, SystemStatusOutput } from "@/ai/flows/system-status-alerts";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

const healthyMetrics = {
  devices: [
    { id: "light-1", type: "light", status: "on", brightness: 80 },
    { id: "thermostat-1", type: "thermostat", status: "on", temp: 22 },
  ],
  energy: { current_usage: 1.1, peak_today: 3.4 },
  network: { status: "connected", signal_strength: -55 },
};

const anomalyMetrics = {
  devices: [
    { id: "light-1", type: "light", status: "unresponsive", brightness: 0 },
    { id: "thermostat-1", type: "thermostat", status: "on", temp: 22 },
    { id: "light-2", type: "light", status: "unresponsive", brightness: 0 },
  ],
  energy: { current_usage: 0.2, peak_today: 3.4 },
  network: { status: "connected", signal_strength: -85 },
};

export default function SystemStatusPage() {
  const [analysis, setAnalysis] = React.useState<SystemStatusOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();

  const handleCheckSystem = async (useAnomalyData: boolean) => {
    setIsLoading(true);
    setAnalysis(null);
    try {
      const metrics = useAnomalyData ? anomalyMetrics : healthyMetrics;
      const result = await analyzeSystemStatus({
        systemMetrics: JSON.stringify(metrics, null, 2),
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing system status:", error);
      toast({
        title: "Error",
        description: "Could not analyze system status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          System Status
        </h1>
        <p className="text-muted-foreground">
          View system alerts and run diagnostics.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Diagnostics</CardTitle>
          <CardDescription>
            Use AI to proactively detect anomalies and get plain-language
            explanations.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button onClick={() => handleCheckSystem(false)} disabled={isLoading}>
            {isLoading ? (
              <Loader className="mr-2 animate-spin" />
            ) : (
              <CheckCircle className="mr-2" />
            )}
            Check with Healthy Data
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleCheckSystem(true)}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="mr-2 animate-spin" />
            ) : (
              <AlertCircle className="mr-2" />
            )}
            Check with Anomaly Data
          </Button>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Analyzing system metrics...</p>
            <Progress value={50} className="w-full animate-pulse" />
        </div>
      )}

      {analysis && (
        <Alert variant={analysis.hasAnomalies ? "destructive" : "default"}>
          {analysis.hasAnomalies ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle className="w-4 h-4" />
          )}
          <AlertTitle>
            {analysis.hasAnomalies ? "Anomalies Detected" : "System Healthy"}
          </AlertTitle>
          <AlertDescription>
            {analysis.anomalyExplanation}
          </AlertDescription>
          {analysis.hasAnomalies && (
            <div className="mt-4">
                <h3 className="font-semibold">Recommendations</h3>
                <p className="text-sm text-inherit">{analysis.recommendations}</p>
            </div>
          )}
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server /> Device Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><Lightbulb className="w-5 h-5" /> Lights</span>
              <span className="font-bold text-green-500">3 Online</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground"><Thermometer className="w-5 h-5" /> Thermostats</span>
              <span className="font-bold text-green-500">1 Online</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi /> Network
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold text-green-500">Connected</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Signal Strength</span>
              <span className="font-bold">-55 dBm</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap /> Power
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Status</span>
              <span className="font-bold text-green-500">Online</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Uptime</span>
              <span className="font-bold">28 days</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
