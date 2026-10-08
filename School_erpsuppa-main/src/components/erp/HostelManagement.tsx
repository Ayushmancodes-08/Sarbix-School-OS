
"use client";

import { useState } from "react";
import { BedDouble, Edit, PlusCircle, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/lib/data-context";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/supabase/provider";
import { AdmissionApplication, Hostel, HostelRoom } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ScrollArea } from "../ui/scroll-area";
import HostelAllocationDialog from "./HostelAllocationDialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

export default function HostelManagement() {
  const { hostels, hostelRooms, students } = useData();
  const [isRoomDialogOpen, setIsRoomDialogOpen] = useState(false);
  const [isHostelDialogOpen, setIsHostelDialogOpen] = useState(false);
  const [isAllocationDialogOpen, setIsAllocationDialogOpen] = useState(false);
  
  const [editingRoom, setEditingRoom] = useState<HostelRoom | null>(null);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);

  const { toast } = useToast();
  const supabase = useSupabase();

  const handleAddNewRoom = () => {
    setEditingRoom(null);
    setIsRoomDialogOpen(true);
  };

  const handleEditRoom = (room: HostelRoom) => {
    setEditingRoom(room);
    setIsRoomDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!supabase) return;
    try {
        await supabase.from('hostel_rooms').delete().eq('id', roomId);
        toast({
            title: "Room Deleted",
            description: `The room has been successfully deleted.`,
            variant: "destructive"
        });
    } catch(e) {
        toast({ title: "Error", description: "Could not delete room.", variant: "destructive" });
    }
  };

  const handleSaveRoom = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !hostelRooms) return;
    const formData = new FormData(event.currentTarget);
    const roomNumber = formData.get("roomNumber") as string;
    const capacity = parseInt(formData.get("capacity") as string, 10);
    const hostelId = formData.get("hostelId") as string;

    if (!roomNumber || isNaN(capacity) || capacity <= 0 || !hostelId) {
        toast({ title: "Invalid Input", description: "Please provide a valid room number, capacity and select a hostel.", variant: "destructive" });
        return;
    }
    
    const isDuplicate = hostelRooms.some(
        room => room.hostelId === hostelId && room.roomNumber === roomNumber && room.id !== editingRoom?.id
    );

    if (isDuplicate) {
        toast({
            title: "Duplicate Room Number",
            description: `Room number ${roomNumber} already exists in this hostel.`,
            variant: "destructive"
        });
        return;
    }


    const selectedHostel = hostels?.find(h => h.id === hostelId);
    if (!selectedHostel) {
        toast({ title: "Hostel not found", variant: "destructive" });
        return;
    }

    const roomData = {
        room_number: roomNumber,
        capacity,
        hostel_id: hostelId,
        hostel_name: selectedHostel.name,
    };

    if (editingRoom) {
      await supabase
        .from('hostel_rooms')
        .update(roomData)
        .eq('id', editingRoom.id);
      toast({ title: "Room Updated", description: `Room ${roomNumber} has been updated.` });
    } else {
      await supabase.from('hostel_rooms').insert({ 
          ...roomData,
          occupants: [] 
      });
      toast({ title: "Room Added", description: `New room ${roomNumber} has been added to ${selectedHostel.name}.` });
    }

    setIsRoomDialogOpen(false);
    setEditingRoom(null);
  };

  const handleAddNewHostel = () => {
    setEditingHostel(null);
    setIsHostelDialogOpen(true);
  };

  const handleEditHostel = (hostel: Hostel) => {
    setEditingHostel(hostel);
    setIsHostelDialogOpen(true);
  };

  const handleDeleteHostel = async (hostel: Hostel) => {
    if (!supabase) return;
    try {
        // Delete all rooms associated with this hostel
        await supabase
            .from('hostel_rooms')
            .delete()
            .eq('hostel_id', hostel.id);
        
        // Delete the hostel
        await supabase
            .from('hostels')
            .delete()
            .eq('id', hostel.id);

        toast({
            title: "Hostel Deleted",
            description: `${hostel.name} and all its rooms have been deleted.`,
            variant: "destructive"
        });
    } catch (error) {
        console.error("Error deleting hostel:", error);
        toast({
            title: "Error",
            description: "Could not delete the hostel. Please try again.",
            variant: "destructive"
        });
    }
  };

  const handleSaveHostel = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase || !hostels) return;
    const formData = new FormData(event.currentTarget);
    const name = formData.get("hostelName") as string;
    const type = formData.get("hostelType") as 'Boys' | 'Girls';

    if (!name || !type) {
        toast({ title: "Invalid Input", description: "Please provide a valid name and type.", variant: "destructive" });
        return;
    }
    
    const isDuplicate = hostels.some(
        hostel => hostel.name.toLowerCase() === name.toLowerCase() && hostel.id !== editingHostel?.id
    );

    if (isDuplicate) {
        toast({
            title: "Duplicate Hostel Name",
            description: `A hostel with the name "${name}" already exists.`,
            variant: "destructive"
        });
        return;
    }


    if (editingHostel) {
      await supabase
        .from('hostels')
        .update({ name, type })
        .eq('id', editingHostel.id);

      if (editingHostel.name !== name) {
          // Update all rooms with the new hostel name
          await supabase
            .from('hostel_rooms')
            .update({ hostel_name: name })
            .eq('hostel_id', editingHostel.id);
      }

      toast({ title: "Hostel Updated", description: `${name} has been updated.` });
    } else {
      await supabase.from('hostels').insert({ name, type });
      toast({ title: "Hostel Added", description: `New hostel "${name}" has been created.` });
    }
    setIsHostelDialogOpen(false);
    setEditingHostel(null);
  };
  
  const occupants = hostelRooms?.flatMap(room => room.occupants.map(name => ({
      studentName: name,
      roomNumber: room.roomNumber,
      hostelName: room.hostelName
  }))) || [];

  // Debug logging
  console.log('HostelManagement Debug:', {
    hostelRoomsCount: hostelRooms?.length || 0,
    hostelRooms: hostelRooms,
    occupantsCount: occupants.length,
    occupants: occupants
  });

  const handleEditOccupant = (occupant: {studentName: string}) => {
    const student = students?.find(s => s.name === occupant.studentName);
    if (student) {
        const application: AdmissionApplication = {
            id: student.id,
            studentName: student.name,
            gender: 'N/A',
            applyingForGrade: student.class,
            parentName: 'N/A',
            parentEmail: 'N/A',
            status: 'Approved',
            date: new Date().toISOString()
        }
        setSelectedApplication(application);
        setIsAllocationDialogOpen(true);
    } else {
        toast({title: "Error", description: "Could not find student details to edit.", variant: "destructive"});
    }
  };

  const handleDeleteOccupant = async (occupant: { studentName: string; roomNumber: string; hostelName: string }) => {
    if (!supabase) return;

        try {
            const { data: roomData } = await supabase
                .from('hostel_rooms')
                .select('*')
                .eq('room_number', occupant.roomNumber)
                .eq('hostel_name', occupant.hostelName)
                .single();

            if (!roomData) {
                toast({ title: "Error", description: "Could not find the room to update.", variant: "destructive" });
                return;
            }
            
            const updatedOccupants = roomData.occupants.filter((name: string) => name !== occupant.studentName);
            
            await supabase
                .from('hostel_rooms')
                .update({ occupants: updatedOccupants })
                .eq('id', roomData.id);
            
            toast({
                title: "Occupant Removed",
                description: `${occupant.studentName} has been removed from room ${occupant.roomNumber}.`
            });
        } catch (error) {
             console.error("Error removing occupant:", error);
            toast({
                title: "Error",
                description: "Could not remove occupant. Please try again.",
                variant: "destructive"
            });
        }
  };

  const handleDeleteAllRooms = async () => {
    if (!supabase) return;
    try {
        await supabase.from('hostel_rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        toast({ title: "All Rooms Deleted", description: "All hostel rooms have been cleared.", variant: "destructive" });
    } catch (e) {
        toast({ title: "Error", description: "Could not delete all rooms.", variant: "destructive" });
    }
  };

  const handleDeleteAllHostels = async () => {
    if (!supabase) return;
    try {
        // Delete all rooms first
        await supabase.from('hostel_rooms').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        // Delete all hostels
        await supabase.from('hostels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
        
        toast({ title: "All Hostel Data Deleted", description: "All hostels and rooms have been cleared.", variant: "destructive" });
    } catch (e) {
        toast({ title: "Error", description: "Could not delete all hostel data.", variant: "destructive" });
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
                <BedDouble /> Hostel Management
            </CardTitle>
            <CardDescription>Manage hostels, rooms, and view occupants.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="rooms">
            <div className="overflow-x-auto -mx-6 px-6 mb-4">
              <TabsList className="inline-flex w-auto min-w-full md:w-full md:grid md:grid-cols-3">
                  <TabsTrigger value="rooms" className="flex-shrink-0">Rooms</TabsTrigger>
                  <TabsTrigger value="hostels" className="flex-shrink-0">Hostels</TabsTrigger>
                  <TabsTrigger value="occupants" className="flex-shrink-0">Occupants</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="rooms" className="mt-4">
              <div className="flex justify-end gap-2 mb-4">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                            <Trash className="mr-2 h-4 w-4" /> Delete All Rooms
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all hostel rooms and remove all occupants.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAllRooms}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                 <Button onClick={handleAddNewRoom} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
                </Button>
              </div>
              <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 scrollbar-visible">
                <ScrollArea className="h-[400px] rounded-md border">
                  <div className="min-w-[640px] md:min-w-0">
                    <Table>
                      <TableHeader className="sticky top-0 bg-card">
                        <TableRow>
                          <TableHead>Room No.</TableHead>
                          <TableHead>Hostel</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Occupants</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                  <TableBody>
                    {hostelRooms && hostelRooms.length > 0 ? (
                      hostelRooms.map((room) => (
                        <TableRow key={room.id}>
                          <TableCell className="font-medium">{room.roomNumber}</TableCell>
                          <TableCell>{room.hostelName}</TableCell>
                          <TableCell>{room.capacity}</TableCell>
                          <TableCell>{room.occupants.length}</TableCell>
                          <TableCell>
                            {room.occupants.length === room.capacity ? (
                              <Badge variant="destructive">Full</Badge>
                            ) : room.occupants.length > 0 ? (
                              <Badge variant="warning">Partially Full</Badge>
                            ) : (
                              <Badge variant="success">Empty</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => handleEditRoom(room)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                             <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Room?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to delete Room {room.roomNumber}? This cannot be undone.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDeleteRoom(room.id)}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No hostel rooms found. Add one to get started.</TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
            </TabsContent>

            <TabsContent value="hostels" className="mt-4">
                <div className="flex justify-end gap-2 mb-4">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                                <Trash className="mr-2 h-4 w-4" /> Delete All Hostels
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete all hostels and rooms.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteAllHostels}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    <Button onClick={handleAddNewHostel} size="sm">
                        <PlusCircle className="mr-2 h-4 w-4" /> Add New Hostel
                    </Button>
                </div>
                <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 scrollbar-visible">
                  <ScrollArea className="h-[400px] rounded-md border">
                      <div className="min-w-[480px] md:min-w-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Hostel Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                            {hostels && hostels.length > 0 ? (
                                hostels.map(hostel => (
                                    <TableRow key={hostel.id}>
                                        <TableCell className="font-medium">{hostel.name}</TableCell>
                                        <TableCell>{hostel.type}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditHostel(hostel)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete {hostel.name}?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This will also delete all rooms inside this hostel. This action cannot be undone.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteHostel(hostel)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">No hostels found.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>

            <TabsContent value="occupants" className="mt-4">
                 <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 scrollbar-visible">
                   <ScrollArea className="h-[400px] rounded-md border">
                      <div className="min-w-[640px] md:min-w-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Hostel</TableHead>
                                    <TableHead>Room No.</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                            {occupants.length > 0 ? (
                                occupants.map((occ, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-medium">{occ.studentName}</TableCell>
                                        <TableCell>{occ.hostelName}</TableCell>
                                        <TableCell>{occ.roomNumber}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleEditOccupant(occ)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Remove Occupant?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to remove {occ.studentName} from this room?
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDeleteOccupant(occ)}>Remove</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">No students are currently in the hostel.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                  </div>
                 </ScrollArea>
               </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isRoomDialogOpen} onOpenChange={setIsRoomDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveRoom}>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingRoom ? "Edit Room" : "Add New Room"}</DialogTitle>
              <DialogDescription>
                {editingRoom ? `Update the details for room ${editingRoom.roomNumber}.` : "Enter the details for the new hostel room."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hostelId">Hostel</Label>
                <Select name="hostelId" defaultValue={editingRoom?.hostelId} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a hostel" />
                    </SelectTrigger>
                    <SelectContent>
                        {hostels?.map(hostel => (
                            <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input id="roomNumber" name="roomNumber" defaultValue={editingRoom?.roomNumber || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input id="capacity" name="capacity" type="number" defaultValue={editingRoom?.capacity || ""} required min="1" />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsRoomDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Save Room</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isHostelDialogOpen} onOpenChange={setIsHostelDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSaveHostel}>
            <DialogHeader>
              <DialogTitle className="font-headline">{editingHostel ? "Edit Hostel" : "Add New Hostel"}</DialogTitle>
              <DialogDescription>
                {editingHostel ? `Update details for ${editingHostel.name}.` : "Create a new hostel building."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="hostelName">Hostel Name</Label>
                <Input id="hostelName" name="hostelName" defaultValue={editingHostel?.name || ""} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hostelType">Hostel Type</Label>
                <Select name="hostelType" defaultValue={editingHostel?.type} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Boys">Boys</SelectItem>
                        <SelectItem value="Girls">Girls</SelectItem>
                    </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsHostelDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Hostel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <HostelAllocationDialog
        open={isAllocationDialogOpen}
        onOpenChange={setIsAllocationDialogOpen}
        application={selectedApplication}
        onAllocationSuccess={() => {}}
      />
    </>
  );
}
