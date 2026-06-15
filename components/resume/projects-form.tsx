"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject } = useResume();

  return (
    <div className="flex flex-col gap-4">
      {data.projects.map((proj, idx) => (
        <div key={proj.id} className="flex flex-col gap-3">
          {idx > 0 && <Separator className="my-1" />}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Project {idx + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeProject(proj.id)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Project Name</Label>
            <Input
              value={proj.name}
              onChange={(e) => updateProject(proj.id, { name: e.target.value })}
              placeholder="Project name"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
            <Textarea
              value={proj.description}
              onChange={(e) => updateProject(proj.id, { description: e.target.value })}
              placeholder="What the project does, your role, impact..."
              rows={3}
              className="resize-none text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Technologies</Label>
            <Input
              value={proj.technologies}
              onChange={(e) => updateProject(proj.id, { technologies: e.target.value })}
              placeholder="React, Node.js, PostgreSQL..."
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">Link (optional)</Label>
            <Input
              value={proj.link}
              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
              placeholder="github.com/user/project"
            />
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addProject} className="gap-1.5 mt-1">
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Project
      </Button>
    </div>
  );
}
