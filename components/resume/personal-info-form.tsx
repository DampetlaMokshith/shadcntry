"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResume();
  const info = data.personalInfo;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="fullName" className="text-xs font-medium text-muted-foreground">Full Name</Label>
        <Input
          id="fullName"
          value={info.fullName}
          onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
          placeholder="e.g. Alex Johnson"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="jobTitle" className="text-xs font-medium text-muted-foreground">Job Title</Label>
        <Input
          id="jobTitle"
          value={info.jobTitle}
          onChange={(e) => updatePersonalInfo({ jobTitle: e.target.value })}
          placeholder="e.g. Senior Frontend Developer"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-xs font-medium text-muted-foreground">Email</Label>
          <Input
            id="email"
            type="email"
            value={info.email}
            onChange={(e) => updatePersonalInfo({ email: e.target.value })}
            placeholder="email@example.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone" className="text-xs font-medium text-muted-foreground">Phone</Label>
          <Input
            id="phone"
            value={info.phone}
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="location" className="text-xs font-medium text-muted-foreground">Location</Label>
          <Input
            id="location"
            value={info.location}
            onChange={(e) => updatePersonalInfo({ location: e.target.value })}
            placeholder="City, State"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="website" className="text-xs font-medium text-muted-foreground">Website</Label>
          <Input
            id="website"
            value={info.website}
            onChange={(e) => updatePersonalInfo({ website: e.target.value })}
            placeholder="yoursite.com"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="linkedin" className="text-xs font-medium text-muted-foreground">LinkedIn</Label>
        <Input
          id="linkedin"
          value={info.linkedin}
          onChange={(e) => updatePersonalInfo({ linkedin: e.target.value })}
          placeholder="linkedin.com/in/yourname"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="summary" className="text-xs font-medium text-muted-foreground">Professional Summary</Label>
        <Textarea
          id="summary"
          value={info.summary}
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
          placeholder="Brief overview of your professional background..."
          rows={4}
          className="resize-none"
        />
      </div>
    </div>
  );
}
