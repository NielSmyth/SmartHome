"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Plus, UserPlus } from "lucide-react";
import {
  useAppContext,
  type UserProfile,
  type Device,
  type Room,
  type Scene,
  type Automation,
} from "@/context/app-state-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schemas for form validation
const userFormSchema = z.object({
  role: z.enum(["admin", "user"]),
});

const deviceFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  location: z.string().min(1, "Location is required."),
  type: z.string().min(1, "Type is required."),
});

const roomFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  temp: z.coerce.number(),
});

const sceneFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
});

const automationFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  description: z.string().min(1, "Description is required."),
  trigger: z.string().min(1, "Trigger is required."),
  action: z.string().min(1, "Action is required."),
});

// User Management Components
const EditUserRoleDialog = ({ user }: { user: UserProfile }) => {
  const { handleUpdateUserRole } = useAppContext();
  const [isOpen, setIsOpen] = React.useState(false);
  const form = useForm({
    resolver: zodResolver(userFormSchema),
    defaultValues: { role: user.role },
  });

  const onSubmit = (data: z.infer<typeof userFormSchema>) => {
    handleUpdateUserRole(user.id, data.role);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          Edit Role
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Role for {user.name}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const UserManagement = () => {
  const { users, handleDeleteUser } = useAppContext();
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Manage system users and their access levels.
        </p>
        <Button disabled>
          <UserPlus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge
                    variant={user.role === "admin" ? "default" : "secondary"}
                  >
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <EditUserRoleDialog user={user} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive"
                          >
                            Delete User
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the user.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Generic CRUD Components
const CrudDialog = ({
  schema,
  defaultValues,
  onSubmit,
  children,
  dialogTitle,
  dialogDescription,
  formFields,
  isOpen,
  setIsOpen,
}: any) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  React.useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onFormSubmit = (data: any) => {
    onSubmit(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogDescription>{dialogDescription}</DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">{formFields(form)}</div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

// Device Management
const DeviceManagement = () => {
  const { devices, handleCreateDevice, handleUpdateDevice, handleDeleteDevice } =
    useAppContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingDevice, setEditingDevice] = React.useState<Device | null>(null);

  const openDialog = (device: Device | null = null) => {
    setEditingDevice(device);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingDevice) {
      handleUpdateDevice(editingDevice.name, data);
    } else {
      handleCreateDevice(data);
    }
  };

  const formFields = (form: any) => (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Living Room Lights" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Living Room" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Input placeholder="e.g., light" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Manage all connected devices.</p>
        <CrudDialog
          schema={deviceFormSchema}
          defaultValues={{ name: "", location: "", type: "" }}
          onSubmit={onSubmit}
          dialogTitle="Create Device"
          dialogDescription="Add a new device to your system."
          formFields={formFields}
          isOpen={isDialogOpen && !editingDevice}
          setIsOpen={setIsDialogOpen}
        >
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Device
          </Button>
        </CrudDialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.name}>
                <TableCell>{device.name}</TableCell>
                <TableCell>{device.location}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{device.type}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <CrudDialog
                    schema={deviceFormSchema}
                    defaultValues={device}
                    onSubmit={onSubmit}
                    dialogTitle="Edit Device"
                    dialogDescription="Update the details for this device."
                    formFields={formFields}
                    isOpen={isDialogOpen && editingDevice?.name === device.name}
                    setIsOpen={setIsDialogOpen}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(device)}
                    >
                      Edit
                    </Button>
                  </CrudDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the device.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteDevice(device.name)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Room Management
const RoomManagement = () => {
  const { rooms, handleCreateRoom, handleUpdateRoom, handleDeleteRoom } =
    useAppContext();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [editingRoom, setEditingRoom] = React.useState<Room | null>(null);

  const openDialog = (room: Room | null = null) => {
    setEditingRoom(room);
    setIsDialogOpen(true);
  };

  const onSubmit = (data: any) => {
    if (editingRoom) {
      handleUpdateRoom(editingRoom.name, data);
    } else {
      handleCreateRoom(data);
    }
  };

  const formFields = (form: any) => (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Living Room" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="temp"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Temperature</FormLabel>
            <FormControl>
              <Input type="number" placeholder="e.g., 22" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Add, edit, or remove rooms.</p>
        <CrudDialog
          schema={roomFormSchema}
          defaultValues={{ name: "", temp: 22 }}
          onSubmit={onSubmit}
          dialogTitle="Create Room"
          dialogDescription="Add a new room to your home."
          formFields={formFields}
          isOpen={isDialogOpen && !editingRoom}
          setIsOpen={setIsDialogOpen}
        >
          <Button onClick={() => openDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Add Room
          </Button>
        </CrudDialog>
      </div>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Temperature</TableHead>
              <TableHead>Device Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room.name}>
                <TableCell>{room.name}</TableCell>
                <TableCell>{room.temp}°C</TableCell>
                <TableCell>{room.devices.length}</TableCell>
                <TableCell className="text-right">
                  <CrudDialog
                    schema={roomFormSchema}
                    defaultValues={room}
                    onSubmit={onSubmit}
                    dialogTitle="Edit Room"
                    dialogDescription="Update the details for this room."
                    formFields={formFields}
                    isOpen={isDialogOpen && editingRoom?.name === room.name}
                    setIsOpen={setIsDialogOpen}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(room)}
                    >
                      Edit
                    </Button>
                  </CrudDialog>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteRoom(room.name)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

// Scene Management
const SceneManagement = () => {
    const { scenes, handleCreateScene, handleUpdateScene, handleDeleteScene } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingScene, setEditingScene] = React.useState<Scene | null>(null);

    const openDialog = (scene: Scene | null = null) => {
        setEditingScene(scene);
        setIsDialogOpen(true);
    };

    const onSubmit = (data: any) => {
        if (editingScene) {
            handleUpdateScene(editingScene.name, data);
        } else {
            handleCreateScene(data.name, data.description);
        }
    };

    const formFields = (form: any) => (
        <>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Movie Night" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl><Textarea placeholder="Describe the scene" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
        </>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage preset scenes.</p>
                <CrudDialog schema={sceneFormSchema} defaultValues={{ name: "", description: "" }} onSubmit={onSubmit} dialogTitle="Create Scene" dialogDescription="Create a new scene." formFields={formFields} isOpen={isDialogOpen && !editingScene} setIsOpen={setIsDialogOpen}>
                    <Button onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" /> Add Scene</Button>
                </CrudDialog>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {scenes.map((scene) => (
                            <TableRow key={scene.name}>
                                <TableCell>{scene.name}</TableCell>
                                <TableCell>{scene.description}</TableCell>
                                <TableCell className="text-right">
                                    <CrudDialog schema={sceneFormSchema} defaultValues={scene} onSubmit={onSubmit} dialogTitle="Edit Scene" dialogDescription="Update this scene." formFields={formFields} isOpen={isDialogOpen && editingScene?.name === scene.name} setIsOpen={setIsDialogOpen}>
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(scene)}>Edit</Button>
                                    </CrudDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteScene(scene.name)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

// Automation Management
const AutomationManagement = () => {
    const { automations, handleCreateAutomation, handleUpdateAutomation, handleDeleteAutomation } = useAppContext();
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const [editingAutomation, setEditingAutomation] = React.useState<Automation | null>(null);

    const openDialog = (automation: Automation | null = null) => {
        setEditingAutomation(automation);
        setIsDialogOpen(true);
    };

    const onSubmit = (data: any) => {
        if (editingAutomation) {
            handleUpdateAutomation(editingAutomation.name, data);
        } else {
            handleCreateAutomation(data);
        }
    };

    const formFields = (form: any) => (
        <>
            <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="e.g., Evening Wind Down" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel><FormControl><Textarea placeholder="Describe what this automation does" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="trigger" render={({ field }) => (
                <FormItem><FormLabel>Trigger</FormLabel><FormControl><Input placeholder="e.g., Time of Day" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="action" render={({ field }) => (
                <FormItem><FormLabel>Action</FormLabel><FormControl><Input placeholder="e.g., Turn on Lights" {...field} /></FormControl><FormMessage /></FormItem>
            )} />
        </>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Manage automation rules.</p>
                <CrudDialog schema={automationFormSchema} defaultValues={{ name: "", description: "", trigger: "", action: "" }} onSubmit={onSubmit} dialogTitle="Create Automation" dialogDescription="Create a new automation rule." formFields={formFields} isOpen={isDialogOpen && !editingAutomation} setIsOpen={setIsDialogOpen}>
                    <Button onClick={() => openDialog()}><Plus className="mr-2 h-4 w-4" /> Add Automation</Button>
                </CrudDialog>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Trigger</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {automations.map((automation) => (
                            <TableRow key={automation.name}>
                                <TableCell>{automation.name}</TableCell>
                                <TableCell>{automation.trigger}</TableCell>
                                <TableCell>{automation.action}</TableCell>
                                <TableCell className="text-right">
                                    <CrudDialog schema={automationFormSchema} defaultValues={automation} onSubmit={onSubmit} dialogTitle="Edit Automation" dialogDescription="Update this automation rule." formFields={formFields} isOpen={isDialogOpen && editingAutomation?.name === automation.name} setIsOpen={setIsDialogOpen}>
                                        <Button variant="ghost" size="sm" onClick={() => openDialog(automation)}>Edit</Button>
                                    </CrudDialog>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Delete</Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader><AlertDialogTitle>Are you sure?</AlertDialogTitle></AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteAutomation(automation.name)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};


export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">
          Admin Control Center
        </h1>
        <p className="text-muted-foreground">
          Manage all aspects of your smart home system.
        </p>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="scenes">Scenes</TabsTrigger>
          <TabsTrigger value="automations">Automations</TabsTrigger>
        </TabsList>
        <TabsContent value="users" className="mt-6">
          <UserManagement />
        </TabsContent>
        <TabsContent value="devices" className="mt-6">
          <DeviceManagement />
        </TabsContent>
        <TabsContent value="rooms" className="mt-6">
          <RoomManagement />
        </TabsContent>
        <TabsContent value="scenes" className="mt-6">
          <SceneManagement />
        </TabsContent>
        <TabsContent value="automations" className="mt-6">
          <AutomationManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
