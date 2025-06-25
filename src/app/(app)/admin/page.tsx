
"use client";

import { useAppContext } from "@/context/app-state-context";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { Device, Automation, NewDeviceData, NewAutomationData } from "@/context/app-state-context";

const deviceFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    location: z.string().min(1, "Location is required."),
    type: z.string().min(1, "Type is required."),
    iconName: z.string().min(1, "Icon name is required."),
});

const automationFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    description: z.string().min(1, "Description is required."),
    trigger: z.string().min(1, "Please select a trigger."),
    action: z.string().min(1, "Please select an action."),
});

export default function AdminPage() {
    const { isAdmin, devices, automations, handleCreateDevice, handleUpdateDevice, handleDeleteDevice, handleUpdateAutomation, handleDeleteAutomation } = useAppContext();
    const router = useRouter();

    const [isDeviceFormOpen, setDeviceFormOpen] = React.useState(false);
    const [editingDevice, setEditingDevice] = React.useState<Device | null>(null);

    const [isAutomationFormOpen, setAutomationFormOpen] = React.useState(false);
    const [editingAutomation, setEditingAutomation] = React.useState<Automation | null>(null);

    const [itemToDelete, setItemToDelete] = React.useState<{ type: 'device' | 'automation'; id: string; name: string } | null>(null);

    const deviceForm = useForm<z.infer<typeof deviceFormSchema>>({
        resolver: zodResolver(deviceFormSchema),
        defaultValues: { name: "", location: "", type: "", iconName: "Lightbulb" },
    });

    const automationForm = useForm<z.infer<typeof automationFormSchema>>({
        resolver: zodResolver(automationFormSchema),
        defaultValues: { name: "", description: "", trigger: "", action: "" },
    });

    React.useEffect(() => {
        if (!isAdmin) {
            router.push('/dashboard');
        }
    }, [isAdmin, router]);

    const handleOpenDeviceDialog = (device: Device | null) => {
        setEditingDevice(device);
        deviceForm.reset(device ? { name: device.name, location: device.location, type: device.type, iconName: device.iconName } : { name: "", location: "", type: "", iconName: "Lightbulb" });
        setDeviceFormOpen(true);
    };
    
    const handleOpenAutomationDialog = (automation: Automation) => {
        setEditingAutomation(automation);
        automationForm.reset({ name: automation.name, description: automation.description, trigger: automation.trigger, action: automation.action });
        setAutomationFormOpen(true);
    };

    const onDeviceSubmit = (data: NewDeviceData) => {
        if (editingDevice) {
            handleUpdateDevice(editingDevice.id, data);
        } else {
            handleCreateDevice(data);
        }
        setDeviceFormOpen(false);
    };

    const onAutomationSubmit = (data: NewAutomationData) => {
        if (editingAutomation) {
            handleUpdateAutomation(editingAutomation.id, data);
        }
        setAutomationFormOpen(false);
    };

    const onDeleteConfirm = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'device') {
            handleDeleteDevice(itemToDelete.id);
        } else {
            handleDeleteAutomation(itemToDelete.id);
        }
        setItemToDelete(null);
    };

    if (!isAdmin) {
        return <div className="flex items-center justify-center h-full"><p>Redirecting...</p></div>;
    }

    return (
        <>
            <div className="flex flex-col gap-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Panel</h1>
                    <p className="text-muted-foreground">Manage your smart home system data.</p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Devices</CardTitle>
                            <CardDescription>All connected devices in the system.</CardDescription>
                        </div>
                        <Button onClick={() => handleOpenDeviceDialog(null)}><Plus /> Add Device</Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {devices.map(device => (
                                    <TableRow key={device.id}>
                                        <TableCell>{device.name}</TableCell>
                                        <TableCell>{device.location}</TableCell>
                                        <TableCell>{device.type}</TableCell>
                                        <TableCell>{device.status}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenDeviceDialog(device)}><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setItemToDelete({ type: 'device', id: device.id, name: device.name })}><Trash2 className="w-4 h-4 text-destructive" /></Button>
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
                        <CardDescription>All automation rules configured in the system.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Trigger</TableHead>
                                    <TableHead>Action</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {automations.map(auto => (
                                    <TableRow key={auto.id}>
                                        <TableCell>{auto.name}</TableCell>
                                        <TableCell>{auto.trigger}</TableCell>
                                        <TableCell>{auto.action}</TableCell>
                                        <TableCell>{auto.status}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenAutomationDialog(auto)}><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => setItemToDelete({ type: 'automation', id: auto.id, name: auto.name })}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Device Form Dialog */}
            <Dialog open={isDeviceFormOpen} onOpenChange={setDeviceFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingDevice ? 'Edit Device' : 'Create New Device'}</DialogTitle>
                        <DialogDescription>{editingDevice ? 'Update the details for this device.' : 'Add a new device to your system.'}</DialogDescription>
                    </DialogHeader>
                    <Form {...deviceForm}>
                        <form onSubmit={deviceForm.handleSubmit(onDeviceSubmit)} className="space-y-4 py-4">
                            <FormField control={deviceForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Device Name</FormLabel><FormControl><Input placeholder="e.g., Living Room Lamp" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={deviceForm.control} name="location" render={({ field }) => (<FormItem><FormLabel>Location</FormLabel><FormControl><Input placeholder="e.g., Living Room" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={deviceForm.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><FormControl><Input placeholder="e.g., light" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={deviceForm.control} name="iconName" render={({ field }) => (<FormItem><FormLabel>Icon Name</FormLabel><FormControl><Input placeholder="e.g., Lamp" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <DialogFooter><Button type="submit">{editingDevice ? 'Save Changes' : 'Create Device'}</Button></DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Automation Form Dialog */}
            <Dialog open={isAutomationFormOpen} onOpenChange={setAutomationFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Automation</DialogTitle>
                        <DialogDescription>Update the details for this automation.</DialogDescription>
                    </DialogHeader>
                    <Form {...automationForm}>
                        <form onSubmit={automationForm.handleSubmit(onAutomationSubmit)} className="space-y-4 py-4">
                            <FormField control={automationForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Automation Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={automationForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={automationForm.control} name="trigger" render={({ field }) => (<FormItem><FormLabel>Trigger</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a trigger" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Time of Day">Time of Day</SelectItem><SelectItem value="Motion Detected">Motion Detected</SelectItem><SelectItem value="Device State Change">Device State Change</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <FormField control={automationForm.control} name="action" render={({ field }) => (<FormItem><FormLabel>Action</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an action" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Turn on Lights">Turn on Lights</SelectItem><SelectItem value="Turn off Lights">Turn off Lights</SelectItem><SelectItem value="Adjust Thermostat">Adjust Thermostat</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
                            <DialogFooter><Button type="submit">Save Changes</Button></DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!itemToDelete} onOpenChange={() => setItemToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the {itemToDelete?.type} named "{itemToDelete?.name}".
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={onDeleteConfirm} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
