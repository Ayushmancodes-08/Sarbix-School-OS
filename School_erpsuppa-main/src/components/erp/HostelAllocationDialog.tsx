
"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { AdmissionApplication, Student, Fee, HostelFee, Hostel } from "@/lib/types";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { addDays, format } from "date-fns";
import { useSupabase } from "@/supabase/provider";

type HostelAllocationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: AdmissionApplication | null;
  onAllocationSuccess: () => void;
};

const studentImages = PlaceHolderImages.filter(p => p.id.startsWith('student-avatar'));

export default function HostelAllocationDialog({ open, onOpenChange, application, onAllocationSuccess }: HostelAllocationDialogProps) {
  const { hostels, hostelRooms, students: allStudents } = useData();
  const { toast } = useToast();
  const supabase = useSupabase();

  const [selectedHostel, setSelectedHostel] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');

  // Effect to reset selections when dialog opens for a new application
  useEffect(() => {
    if (open) {
      setSelectedHostel('');
      setSelectedRoom('');
    }
  }, [application, open]);
  
  const applicantGender = application?.gender?.toLowerCase();
  const availableHostels = useMemo(() => {
    if (!hostels || !applicantGender) return [];
    const genderToType = applicantGender === 'male' ? 'Boys' : 'Girls';
    return hostels.filter(h => h.type === genderToType);
  }, [hostels, applicantGender]);
  
  const availableRooms = useMemo(() => {
    if (!selectedHostel || !hostelRooms) return [];
    return hostelRooms
      .filter(room => room.hostelId === selectedHostel && room.occupants.length < room.capacity)
      .map(room => room.roomNumber);
  }, [selectedHostel, hostelRooms]);

  const handleAllocate = async () => {
    if (!application || !selectedHostel || !selectedRoom || !supabase || !allStudents) {
      toast({ title: "Error", description: "Please select all fields.", variant: "destructive" });
      return;
    }

    let studentId = '';
    const existingStudent = allStudents.find(s => s.name === application.studentName);

    if (!existingStudent) {
        // Database uses snake_case
        const newStudentData = {
            name: application.studentName,
            class: application.applyingForGrade,
            section: 'A' as const, // Default section
            roll_number: String(Math.floor(Math.random() * 100) + 1),
            avatar: studentImages[Math.floor(Math.random() * studentImages.length)].imageUrl,
        };
        const { data: studentData } = await supabase
            .from('students')
            .insert(newStudentData)
            .select()
            .single();
        
        if (!studentData) return;
        studentId = studentData.id;

        const newFee = {
            student_id: studentId,
            student_name: newStudentData.name,
            class: `${newStudentData.class}${newStudentData.section}`,
            amount: 5500,
            status: 'Due' as const,
            due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        };
        await supabase.from('fees').insert(newFee);

    } else {
        studentId = existingStudent.id;
    }

    const roomToUpdate = hostelRooms?.find(r => r.roomNumber === selectedRoom && r.hostelId === selectedHostel);
    console.log('Allocating student to room:', {
      studentName: application.studentName,
      selectedRoom,
      selectedHostel,
      roomToUpdate,
      currentOccupants: roomToUpdate?.occupants
    });
    
    if (roomToUpdate) {
        const updatedOccupants = [...roomToUpdate.occupants, application.studentName];
        console.log('Updating room with occupants:', updatedOccupants);
        
        await supabase
            .from('hostel_rooms')
            .update({
                occupants: updatedOccupants
            })
            .eq('id', roomToUpdate.id);
    }

    // Create a new hostel fee record (database uses snake_case)
    const newHostelFee = {
        student_id: studentId,
        student_name: application.studentName,
        room_number: selectedRoom,
        amount: 2500, // Default hostel fee amount
        status: 'Due' as const,
        due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    };
    await supabase.from('hostel_fees').insert(newHostelFee);

    toast({
      title: "Hostel Allocated!",
      description: `${application.studentName} has been allocated to Room ${selectedRoom}.`,
    });

    onAllocationSuccess();
    onOpenChange(false);
  };
  
  const resetAndClose = () => {
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Hostel Allocation</DialogTitle>
          <DialogDescription>
            Allocate a hostel room for {application?.studentName} (Gender: {application?.gender}).
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
           <div className="space-y-2">
            <Label htmlFor="hostel-name">Hostel</Label>
            <Select 
                value={selectedHostel} 
                onValueChange={setSelectedHostel} 
                disabled={availableHostels.length === 0}
            >
              <SelectTrigger id="hostel-name">
                <SelectValue placeholder={availableHostels.length > 0 ? "Select hostel" : "No suitable hostels found"} />
              </SelectTrigger>
              <SelectContent>
                {availableHostels.map(hostel => (
                  <SelectItem key={hostel.id} value={hostel.id}>{hostel.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="room-number">Room Number</Label>
            <Select 
                value={selectedRoom} 
                onValueChange={setSelectedRoom} 
                disabled={!selectedHostel || (availableRooms || []).length === 0}
            >
              <SelectTrigger id="room-number">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {availableRooms?.map(room => (
                  <SelectItem key={room} value={room}>Room {room}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(availableRooms || []).length === 0 && selectedHostel && (
                <p className="text-xs text-destructive">No available rooms in this hostel.</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={resetAndClose}>Cancel</Button>
          <Button onClick={handleAllocate} disabled={!selectedRoom}>Allocate Room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
