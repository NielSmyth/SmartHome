
"use client";

import { useAppContext } from "@/context/app-state-context";
import { useRouter } from "next/navigation";
import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export default function AdminPage() {
    const { isAdmin, devices, rooms, scenes, automations } = useAppContext();
    const router = useRouter();

    React.useEffect(() => {
        if (!isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, router]);

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center h-full">
                <p>Redirecting...</p>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                    Admin Panel
                </h1>
                <p className="text-muted-foreground">
                    Manage your smart home system data.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Devices</CardTitle>
                    <CardDescription>
                        All connected devices in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {devices.map(device => (
                                <TableRow key={device.id}>
                                    <TableCell>{device.name}</TableCell>
                                    <TableCell>{device.location}</TableCell>
                                    <TableCell>{device.type}</TableCell>
                                    <TableCell>{device.status}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" disabled>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Automations</CardTitle>
                    <CardDescription>
                        All automation rules configured in the system.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Trigger</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {automations.map(auto => (
                                <TableRow key={auto.id}>
                                    <TableCell>{auto.name}</TableCell>
                                    <TableCell>{auto.trigger}</TableCell>
                                    <TableCell>{auto.action}</TableCell>
                                    <TableCell>{auto.status}</TableCell>
                                    <TableCell>
                                        <Button variant="ghost" size="icon" disabled>
                                            <Trash2 className="w-4 h-4 text-destructive" />
                                        </Button>
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
