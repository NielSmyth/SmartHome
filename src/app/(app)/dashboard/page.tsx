"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clapperboard, Lightbulb, Thermometer, Zap } from "lucide-react";
import Link from "next/link";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

const chartData = [
  { day: "Monday", usage: 220 },
  { day: "Tuesday", usage: 180 },
  { day: "Wednesday", usage: 250 },
  { day: "Thursday", usage: 210 },
  { day: "Friday", usage: 300 },
  { day: "Saturday", usage: 320 },
  { day: "Sunday", usage: 280 },
];

const chartConfig = {
  usage: {
    label: "Energy (kWh)",
    color: "hsl(var(--primary))",
  },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Welcome Home, User!
        </h1>
        <p className="text-muted-foreground">
          Here's a quick overview of your smart home's status.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Lights</CardTitle>
            <Lightbulb className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">in 3 rooms</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Indoor Temp</CardTitle>
            <Thermometer className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22°C</div>
            <p className="text-xs text-muted-foreground">Comfortable</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Energy Usage</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2 kWh</div>
            <p className="text-xs text-muted-foreground">Live consumption</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Quick Scene</CardTitle>
                <Clapperboard className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <Button className="w-full">Activate Movie Night</Button>
            </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Energy Consumption</CardTitle>
            <CardDescription>
              An overview of your energy usage for the last 7 days.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <AreaChart
                accessibilityLayer
                data={chartData}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <defs>
                  <linearGradient id="fillUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-usage)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-usage)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="usage"
                  type="natural"
                  fill="url(#fillUsage)"
                  stroke="var(--color-usage)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Quick Links</CardTitle>
                <CardDescription>Jump to your most used pages.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                 <Link href="/scenes" className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-muted">
                    <div>
                        <h3 className="font-semibold">Manage Scenes</h3>
                        <p className="text-sm text-muted-foreground">View and create new scenes.</p>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                 </Link>
                 <Link href="/automations" className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-muted">
                    <div>
                        <h3 className="font-semibold">Configure Automations</h3>
                        <p className="text-sm text-muted-foreground">Set up rules for your home.</p>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                 </Link>
                 <Link href="/system" className="flex items-center justify-between p-4 transition-colors rounded-lg hover:bg-muted">
                    <div>
                        <h3 className="font-semibold">Check System Status</h3>
                        <p className="text-sm text-muted-foreground">Run diagnostics and view alerts.</p>
                    </div>
                    <ArrowRight className="w-5 h-5" />
                 </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
