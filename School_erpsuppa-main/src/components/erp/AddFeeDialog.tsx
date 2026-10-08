"use client";

import { useState } from "react";
import { useSupabase } from "@/supabase/provider";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FeeStatus } from "@/lib/types";

type AddFeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feeType: 'tuition' | 'hostel';
};

export default function AddFeeDialog({ open, onOpenChange, feeType }: AddFeeDialogProps) {
  const supabase = useSupabase();
  const { toast } = useToast();
  const { students, hostelRooms } = useData();

  const [studentId, setStudentId] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<FeeStatus>("Due");
  const [dueDate, setDueDate] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!supabase || !studentId || !amount || !dueDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (feeType === 'hostel' && !roomNumber) {
      toast({
        title: "Missing Information",
        description: "Please select a room number for hostel fee.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const student = students?.find(s => s.id === studentId);
      if (!student) {
        throw new Error("Student not found");
      }

      if (feeType === 'tuition') {
        const { error } = await supabase
          .from('fees')
          .insert({
            student_id: studentId,
            student_name: student.name,
            class: `${student.class}${student.section}`,
            amount: parseFloat(amount),
            status: status,
            due_date: dueDate,
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('hostel_fees')
          .insert({
            student_id: studentId,
            student_name: student.name,
            room_number: roomNumber,
            amount: parseFloat(amount),
            status: status,
            due_date: dueDate,
          });

        if (error) throw error;
      }

      toast({
        title: "Fee Added Successfully",
        description: `${feeType === 'tuition' ? 'Tuition' : 'Hostel'} fee has been added for ${student.name}.`,
      });

      // Reset form
      setStudentId("");
      setAmount("");
      setStatus("Due");
      setDueDate("");
      setRoomNumber("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error adding fee:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add fee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-headline">
            Add {feeType === 'tuition' ? 'Tuition' : 'Hostel'} Fee
          </DialogTitle>
          <DialogDescription>
            Create a new fee record for a student.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student</Label>
              <Select value={studentId} onValueChange={setStudentId}>
                <SelectTrigger id="student">
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - Class {student.class}{student.section}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {feeType === 'hostel' && (
              <div className="grid gap-2">
                <Label htmlFor="room">Room Number</Label>
                <Select value={roomNumber} onValueChange={setRoomNumber}>
                  <SelectTrigger id="room">
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostelRooms?.map((room) => (
                      <SelectItem key={room.id} value={room.roomNumber}>
                        {room.hostelName} - Room {room.roomNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                placeholder="10000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(value) => setStatus(value as FeeStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paid">Paid</SelectItem>
                  <SelectItem value="Due">Due</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Fee"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
