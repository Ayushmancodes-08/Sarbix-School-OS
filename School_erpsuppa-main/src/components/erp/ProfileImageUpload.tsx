"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/supabase/provider";
import { Upload, Loader2, User } from "lucide-react";
import Image from "next/image";

type ProfileImageUploadProps = {
  studentId: string;
  currentAvatar: string;
  onUploadSuccess: (newAvatarUrl: string) => void;
  userType?: 'student' | 'teacher';
};

export default function ProfileImageUpload({ 
  studentId, 
  currentAvatar, 
  onUploadSuccess,
  userType = 'student'
}: ProfileImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = useSupabase();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      // Show preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to Supabase Storage
      await uploadImage(file);
    } catch (error) {
      console.error('Error selecting file:', error);
      toast({
        title: "Error",
        description: "Failed to select image",
        variant: "destructive"
      });
    }
  };

  const uploadImage = async (file: File) => {
    if (!supabase) {
      toast({
        title: "Error",
        description: "Database not connected",
        variant: "destructive"
      });
      return;
    }

    setUploading(true);

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${studentId}-${Date.now()}.${fileExt}`;
      const folderName = userType === 'teacher' ? 'teacher-avatars' : 'student-avatars';
      const filePath = `${folderName}/${fileName}`;

      console.log('Uploading image:', { fileName, filePath, fileSize: file.size });

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        
        // Check if bucket doesn't exist
        if (uploadError.message.includes('Bucket not found')) {
          throw new Error('Storage bucket not configured. Please run SETUP-STORAGE-BUCKETS.sql in your Supabase SQL Editor.');
        }
        
        throw uploadError;
      }

      console.log('Upload successful:', uploadData);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const publicUrl = urlData.publicUrl;
      console.log('Public URL:', publicUrl);

      // Update record with new avatar URL
      const tableName = userType === 'teacher' ? 'teachers' : 'students';
      const { error: updateError } = await supabase
        .from(tableName)
        .update({ avatar: publicUrl })
        .eq('id', studentId);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      console.log(`${userType} avatar updated successfully`);

      toast({
        title: "Upload Successful!",
        description: "Your profile picture has been updated.",
      });

      onUploadSuccess(publicUrl);
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
        {preview || currentAvatar ? (
          <Image
            src={preview || currentAvatar}
            alt="Profile"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <input
          type="file"
          id={`avatar-upload-${studentId}`}
          accept="image/*"
          onChange={handleFileSelect}
          disabled={uploading}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => document.getElementById(`avatar-upload-${studentId}`)?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </>
          )}
        </Button>
        <p className="text-xs text-muted-foreground">
          JPG, PNG or GIF (max 5MB)
        </p>
      </div>
    </div>
  );
}
