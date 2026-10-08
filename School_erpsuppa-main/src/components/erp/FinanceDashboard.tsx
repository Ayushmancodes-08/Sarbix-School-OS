"use client";

import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/supabase/provider";
import { DollarSign, Edit, Receipt, TrendingUp, Users, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import FeeStatusChart from "./FeeStatusChart";
import KpiCard from "./KpiCard";
import { useData } from "@/lib/data-context";
import { useState } from "react";
import { Fee, HostelFee } from "@/lib/types";
import EditFeeDialog from "./EditFeeDialog";
import AddFeeDialog from "./AddFeeDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import HostelManagement from "./HostelManagement";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function FinanceDashboard() {
  const { fees, hostelFees } = useData();
  const { toast } = useToast();
  const supabase = useSupabase();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | HostelFee | null>(null);
  const [selectedFeeType, setSelectedFeeType] = useState<'tuition' | 'hostel' | null>(null);
  const [addFeeType, setAddFeeType] = useState<'tuition' | 'hostel'>('tuition');

  const totalFees = fees?.reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const paidFees = fees?.filter(f => f.status === 'Paid').reduce((sum, fee) => sum + fee.amount, 0) || 0;
  const dueFees = totalFees - paidFees;
  const collectionRate = totalFees > 0 ? (paidFees / totalFees) * 100 : 0;

  const handleGenerateReceipt = (studentName: string) => {
    toast({
      title: "Receipt Generated",
      description: `Fee receipt for ${studentName} has been generated and sent.`,
    });
  };

  const handleEditClick = (fee: Fee | HostelFee, type: 'tuition' | 'hostel') => {
    setSelectedFee(fee);
    setSelectedFeeType(type);
    setIsEditDialogOpen(true);
  };

  const handleAddClick = (type: 'tuition' | 'hostel') => {
    setAddFeeType(type);
    setIsAddDialogOpen(true);
  };

  const handleDeleteClick = (fee: Fee | HostelFee, type: 'tuition' | 'hostel') => {
    setSelectedFee(fee);
    setSelectedFeeType(type);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!supabase || !selectedFee || !selectedFeeType) return;

    try {
      const tableName = selectedFeeType === 'tuition' ? 'fees' : 'hostel_fees';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', selectedFee.id);

      if (error) throw error;

      toast({
        title: "Fee Deleted",
        description: `${selectedFeeType === 'tuition' ? 'Tuition' : 'Hostel'} fee has been deleted successfully.`,
      });

      setIsDeleteDialogOpen(false);
      setSelectedFee(null);
      setSelectedFeeType(null);
    } catch (error: any) {
      console.error("Error deleting fee:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete fee. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <div className="space-y-6">
      <div className="overflow-x-auto pb-2 scrollbar-visible">
        <div className="flex gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Collection Rate"
              icon={<TrendingUp className="h-6 w-6" />}
              value={`${collectionRate.toFixed(1)}%`}
              description={`₹${paidFees.toLocaleString()} / ₹${totalFees.toLocaleString()}`}
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Total Collected"
              icon={<DollarSign className="h-6 w-6" />}
              value={`₹${paidFees.toLocaleString()}`}
              description="This academic year"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Total Due"
              icon={<DollarSign className="h-6 w-6 text-destructive" />}
              value={`₹${dueFees.toLocaleString()}`}
              description="Across all students"
            />
          </div>
          <div className="min-w-[240px] flex-shrink-0 md:min-w-0">
            <KpiCard
              title="Overdue Payments"
              icon={<Users className="h-6 w-6 text-destructive" />}
              value={fees?.filter(f => f.status === 'Overdue').length.toString() || '0'}
              description="Students with overdue fees"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ScrollArea className="w-full">
            <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
              <Card className="overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="font-headline">Fee Management</CardTitle>
                        <CardDescription>Overview of tuition and hostel fees for all students.</CardDescription>
                      </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="tuition">
                        <div className="overflow-x-auto -mx-6 px-6 mb-4">
                          <TabsList className="inline-flex w-auto min-w-full md:w-full md:grid md:grid-cols-2">
                              <TabsTrigger value="tuition" className="flex-shrink-0">Tuition Fees</TabsTrigger>
                              <TabsTrigger value="hostel" className="flex-shrink-0">Hostel Fees</TabsTrigger>
                          </TabsList>
                        </div>
                        <TabsContent value="tuition">
                            <div className="flex justify-end mb-4">
                              <Button onClick={() => handleAddClick('tuition')} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Tuition Fee
                              </Button>
                            </div>
                            <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 mt-4 scrollbar-visible">
                              <ScrollArea className="h-[450px]">
                                <div className="min-w-[640px] md:min-w-0">
                                  <Table>
                                      <TableHeader>
                                      <TableRow>
                                          <TableHead>Student Name</TableHead>
                                          <TableHead>Class</TableHead>
                                          <TableHead>Amount</TableHead>
                                          <TableHead>Status</TableHead>
                                          <TableHead className="text-right">Actions</TableHead>
                                      </TableRow>
                                      </TableHeader>
                                <TableBody>
                                {fees?.map((fee) => (
                                    <TableRow key={fee.id}>
                                    <TableCell className="font-medium">{fee.studentName}</TableCell>
                                    <TableCell>{fee.class}</TableCell>
                                    <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Due' ? 'warning' : 'destructive'}>
                                        {fee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditClick(fee, 'tuition')}
                                          disabled={fee.status === 'Paid'}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleGenerateReceipt(fee.studentName)}
                                          disabled={fee.status !== 'Paid'}
                                        >
                                          <Receipt className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteClick(fee, 'tuition')}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </div>
                        </TabsContent>
                        <TabsContent value="hostel">
                            <div className="flex justify-end mb-4">
                              <Button onClick={() => handleAddClick('hostel')} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                Add Hostel Fee
                              </Button>
                            </div>
                             <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0 mt-4 scrollbar-visible">
                               <ScrollArea className="h-[450px]">
                                  <div className="min-w-[640px] md:min-w-0">
                                    <Table>
                                        <TableHeader>
                                        <TableRow>
                                            <TableHead>Student Name</TableHead>
                                            <TableHead>Room No.</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                        </TableHeader>
                                <TableBody>
                                {hostelFees?.map((fee) => (
                                    <TableRow key={fee.id}>
                                    <TableCell className="font-medium">{fee.studentName}</TableCell>
                                    <TableCell>{fee.roomNumber}</TableCell>
                                    <TableCell>₹{fee.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant={fee.status === 'Paid' ? 'success' : fee.status === 'Due' ? 'warning' : 'destructive'}>
                                        {fee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleEditClick(fee, 'hostel')}
                                          disabled={fee.status === 'Paid'}
                                        >
                                          <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleGenerateReceipt(fee.studentName)}
                                          disabled={fee.status !== 'Paid'}
                                        >
                                          <Receipt className="h-4 w-4" />
                                        </Button>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() => handleDeleteClick(fee, 'hostel')}
                                        >
                                          <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                    </TableRow>
                                ))}
                                </TableBody>
                            </Table>
                          </div>
                        </ScrollArea>
                      </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
              </Card>
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
        <div className="space-y-6">
          <ScrollArea className="w-full">
            <div className="min-w-[280px] md:min-w-0">
              <FeeStatusChart />
            </div>
            <ScrollBar orientation="horizontal" className="h-3" />
          </ScrollArea>
        </div>
      </div>
      
      <ScrollArea className="w-full">
        <div className="min-w-[calc(100vw-3rem)] md:min-w-0">
          <HostelManagement />
        </div>
        <ScrollBar orientation="horizontal" className="h-3" />
      </ScrollArea>
    </div>
    {selectedFee && selectedFeeType && (
        <EditFeeDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            fee={selectedFee}
            feeType={selectedFeeType}
        />
    )}
    <AddFeeDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        feeType={addFeeType}
    />
    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this fee record. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
