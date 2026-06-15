"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = useResume();

  return (
    <div className="flex flex-col gap-4">
      {data.experience.map((exp, idx) => (
        <div key={exp.id} className="flex flex-col gap-3">
          {idx > 0 && <Separator className="my-1" />}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Position {idx + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeExperience(exp.id)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Company</Label>
              <Input
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                placeholder="Company name"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Position</Label>
              <Input
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, { position: e.target.value })}
                placeholder="Job title"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Location</Label>
            <Input
              value={exp.location}
              onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
              placeholder="City, State or Remote"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
              <Input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">End Date</Label>
              <Input
                type="month"
                value={exp.endDate}
                onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                disabled={exp.current}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={exp.current}
              onCheckedChange={(checked) =>
                updateExperience(exp.id, { current: checked, endDate: checked ? "" : exp.endDate })
              }
              id={`current-${exp.id}`}
            />
            <Label htmlFor={`current-${exp.id}`} className="text-xs text-muted-foreground">Currently working here</Label>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
            <Textarea
              value={exp.description}
              onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
              placeholder="• Key achievement or responsibility..."
              rows={4}
              className="resize-none text-sm"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addExperience} className="gap-1.5 mt-1">
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Experience
      </Button>
    </div>
  );
}
