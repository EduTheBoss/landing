"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useProfile } from "../profile-data-provider"
import { useApi } from "@/hooks/use-api"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfileEditor() {
  const { profile: initialProfile, isLoading: isLoadingProfile, fetchProfile } = useProfile();
  const [profile, setProfile] = useState({
    name: "",
    title: "",
    bio: "",
    photo: "/placeholder.svg?height=320&width=320",
    socialLinks: {
      github: "",
      linkedin: "",
      twitter: "",
      email: "",
      website: "",
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const api = useApi();

  // Update local state when profile data is loaded
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
    }
  }, [initialProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setProfile((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setProfile((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const result = await api.put('/api/profile', profile);
      if (result.success) {
        toast({
          title: "Profile updated",
          description: "Your profile information has been saved successfully.",
        });
        // Refresh the profile data
        await fetchProfile();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update profile.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create a FormData object
      const formData = new FormData();
      formData.append('file', file);
      
      try {
        // Use fetch directly since our useApi hook doesn't support FormData
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        
        if (data.success) {
          setProfile((prev) => ({
            ...prev,
            photo: data.filePath,
          }));
          
          toast({
            title: "Image uploaded",
            description: "Profile photo has been uploaded successfully.",
          });
        } else {
          toast({
            title: "Upload failed",
            description: data.message || "Failed to upload image.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Image upload error:', error);
        toast({
          title: "Upload failed",
          description: "An unexpected error occurred during upload.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="w-24 h-24 rounded-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          
          {[...Array(5)].map((_, idx) => (
            <div className="space-y-2" key={idx}>
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-32" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal information and social media links</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Profile Photo</Label>
            <div className="flex items-center gap-4">
              <img
                src={profile.photo || "/placeholder.svg"}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border"
              />
              <Input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={profile.name} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input id="title" name="title" value={profile.title} onChange={handleChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows={4} />
          </div>

          <div className="pt-4">
            <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  name="socialLinks.github"
                  value={profile.socialLinks.github}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="socialLinks.linkedin"
                  value={profile.socialLinks.linkedin}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  name="socialLinks.twitter"
                  value={profile.socialLinks.twitter}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="socialLinks.email" value={profile.socialLinks.email} onChange={handleChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="socialLinks.website"
                  value={profile.socialLinks.website}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}