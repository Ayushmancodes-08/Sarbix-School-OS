
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useData } from "@/lib/data-context";
import { AdmissionApplication } from "@/lib/types";
import { Check, X, BedDouble } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useState } from "react";
import HostelAllocationDialog from "./HostelAllocationDialog";
import { addDays, format } from "date-fns";
import { useSupabase } from "@/supabase/provider";

const studentImages = PlaceHolderImages.filter(p => p.id.startsWith('student-avatar'));

export default function AdmissionRequests() {
    const { admissionApplications } = useData();
    const { toast } = useToast();
    const [isHostelDialogOpen, setIsHostelDialogOpen] = useState(false);
    const [selectedApplication, setSelectedApplication] = useState<AdmissionApplication | null>(null);
    const supabase = useSupabase();

    const handleApproveClick = async (application: AdmissionApplication) => {
        if (!supabase) return;

        // Create new student (database uses snake_case)
        const newStudent = {
            name: application.studentName,
            class: application.applyingForGrade,
            section: 'A', // Default section
            roll_number: String(Math.floor(Math.random() * 100) + 1), // Assign random roll number
            avatar: studentImages[Math.floor(Math.random() * studentImages.length)].imageUrl,
        };
        const { data: studentData } = await supabase
            .from('students')
            .insert(newStudent)
            .select()
            .single();
        
        if (!studentData) return;
        
        // Create new fee record for finance (database uses snake_case)
        const newFee = {
            student_id: studentData.id,
            student_name: newStudent.name,
            class: `${newStudent.class}${newStudent.section}`,
            amount: 5500, // Default fee amount, can be edited by finance
            status: 'Due' as const,
            due_date: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
        };
        await supabase.from('fees').insert(newFee);

        // Update application status
        await supabase
            .from('admission_applications')
            .update({ status: 'Approved' })
            .eq('id', application.id);

        toast({
            title: `Application Approved`,
            description: `${application.studentName} has been approved. Teacher can now generate login credentials.`,
        });
    };

    const handleRejectClick = async (application: AdmissionApplication) => {
        if (!supabase) return;
        await supabase
            .from('admission_applications')
            .update({ status: 'Rejected' })
            .eq('id', application.id);

        toast({
            title: `Application Rejected`,
            description: `The application for ${application.studentName} has been rejected.`,
            variant: 'destructive',
        });
    }

    const handleHostelClick = (application: AdmissionApplication) => {
        setSelectedApplication(application);
        setIsHostelDialogOpen(true);
    };

    const handleAllocationSuccess = async () => {
        if(selectedApplication && supabase) {
             await supabase
                .from('admission_applications')
                .update({ status: 'Approved' })
                .eq('id', selectedApplication.id);
        }
    }

    const displayedApplications = admissionApplications?.filter(app => app.status === 'Pending') || [];

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Pending Admission Requests</CardTitle>
                    <CardDescription>Review and process new student applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto -mx-6 px-6 md:mx-0 md:px-0">
                      <div className="min-w-[640px]">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Applying for Grade</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Submission Date</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                        <TableBody>
                            {displayedApplications.length > 0 ? (
                                displayedApplications.map(app => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-medium">{app.studentName}</TableCell>
                                    <TableCell>{app.applyingForGrade}</TableCell>
                                    <TableCell className="capitalize">{app.gender}</TableCell>
                                    <TableCell>{app.date}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700" onClick={() => handleApproveClick(app)}>
                                            <Check className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700" onClick={() => handleRejectClick(app)}>
                                            <X className="h-5 w-5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="hover:text-primary" onClick={() => handleHostelClick(app)}>
                                            <BedDouble className="h-5 w-5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground">No pending applications.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                  </div>
                </div>
                </CardContent>
            </Card>
            <HostelAllocationDialog 
                open={isHostelDialogOpen}
                onOpenChange={setIsHostelDialogOpen}
                application={selectedApplication}
                onAllocationSuccess={handleAllocationSuccess}
            />
        </>
    );
}
