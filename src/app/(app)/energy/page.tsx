"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, Area, AreaChart } from "recharts";
import { TrendingUp, Zap, ArrowDown, ArrowUp } from "lucide-react";

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "HVAC",
    color: "hsl(var(--primary))",
  },
  mobile: {
    label: "Lighting",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const sparklineData = [
    { x: 1, y: 10 }, { x: 2, y: 15 }, { x: 3, y: 12 }, { x: 4, y: 18 }, { x: 5, y: 14 },
    { x: 6, y: 22 }, { x: 7, y: 25 }, { x: 8, y: 20 }, { x: 9, y: 28 }, { x: 10, y: 30 }
];

export default function EnergyPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Energy Status
        </h1>
        <p className="text-muted-foreground">
          Monitor your home's energy consumption.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Live Usage</CardTitle>
                  <Zap className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">1.2 kWh</div>
                  <p className="text-xs text-muted-foreground">+5.2% from last hour</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Today's Peak</CardTitle>
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">3.5 kWh</div>
                  <p className="text-xs text-muted-foreground">at 8:30 AM</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Most Efficient Room</CardTitle>
                  <ArrowDown className="w-4 h-4 text-green-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">Bedroom</div>
                  <p className="text-xs text-muted-foreground">Using 8% less than average</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Highest Consumption</CardTitle>
                  <ArrowUp className="w-4 h-4 text-destructive" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">Kitchen</div>
                  <p className="text-xs text-muted-foreground">Using 15% more than average</p>
              </CardContent>
          </Card>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consumption Overview</CardTitle>
            <CardDescription>
              Monthly energy usage by category.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Lighting Usage (Last 24h)</CardTitle>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={{}} className="h-24">
                        <AreaChart accessibilityLayer data={sparklineData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorSpark" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip content={<div className="p-2 text-sm bg-background border rounded-md shadow-lg">Value: { 'payload' in arguments[0] && arguments[0].payload[0] ? arguments[0].payload[0].value : '' }</div>} />
                            <Area type="monotone" dataKey="y" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSpark)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>HVAC Usage (Last 24h)</CardTitle>
                </CardHeader>
                <CardContent>
                   <ChartContainer config={{}} className="h-24">
                        <AreaChart accessibilityLayer data={[...sparklineData].reverse()} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                            <defs>
                                <linearGradient id="colorSparkAccent" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Tooltip content={<div className="p-2 text-sm bg-background border rounded-md shadow-lg">Value: { 'payload' in arguments[0] && arguments[0].payload[0] ? arguments[0].payload[0].value : '' }</div>} />
                            <Area type="monotone" dataKey="y" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorSparkAccent)" />
                        </AreaChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
