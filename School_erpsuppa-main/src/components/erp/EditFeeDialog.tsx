"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Fee, HostelFee } from "@/lib/types";
import { useSupabase } from "@/supabase/provider";
import { useToast } from "@/hooks/use-toast";

type EditFeeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fee: Fee | HostelFee | null;
  feeType: 'tuition' | 'hostel' | null;
};

export default function EditFeeDialog({ open, onOpenChange, fee, feeType }: EditFeeDialogProps) {
  const [amount, setAmount] = useState<number | string>("");
  const supabase = useSupabase();
  const { toast } = useToast();

  useEffect(() => {
    if (fee) {
      setAmount(fee.amount);
    }
  }, [fee]);

  const handleSave = async () => {
    if (fee && amount !== "" && supabase && feeType) {
      const newAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
      if (!isNaN(newAmount)) {
        const tableName = feeType === 'tuition' ? 'fees' : 'hostel_fees';
        if ('id' in fee && fee.id) {
          try {
            await supabase
              .from(tableName)
              .update({ amount: newAmount })
              .eq('id', fee.id);
            
            toast({
              title: "Fee Updated",
              description: `The ${feeType} fee for ${fee.studentName} has been updated to ₹${newAmount}.`
            });
            onOpenChange(false);
          } catch (e: any) {
            console.error("Failed to update fee:", e);
            toast({
                title: "Error",
                description: `Could not update ${feeType} fee. Please try again.`,
                variant: "destructive"
            });
          }
        } else {
            toast({
                title: "Error",
                description: "Could not find the fee record to update. Document ID is missing.",
                variant: "destructive"
            });
        }
      }
    }
  };

  if (!fee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">Edit {feeType === 'tuition' ? 'Tuition' : 'Hostel'} Fee Amount</DialogTitle>
          <DialogDescription>
            Update the fee amount for {fee.studentName}. The current status is {fee.status}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fee-amount">New Fee Amount</Label>
            <Input
              id="fee-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter new amount"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
