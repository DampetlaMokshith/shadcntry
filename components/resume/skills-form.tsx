"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

const levelLabels = ["", "Beginner", "Elementary", "Intermediate", "Advanced", "Expert"];

export function SkillsForm() {
  const { data, addSkill, updateSkill, removeSkill } = useResume();

  return (
    <div className="flex flex-col gap-3">
      {data.skills.map((skill) => (
        <div key={skill.id} className="flex items-center gap-2">
          <div className="flex-1 flex flex-col gap-1.5">
            <Input
              value={skill.name}
              onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
              placeholder="Skill name"
              className="h-8 text-sm"
            />
            <div className="flex items-center gap-2 px-0.5">
              <Slider
                value={[skill.level]}
                onValueChange={([val]) => updateSkill(skill.id, { level: val })}
                min={1}
                max={5}
                step={1}
                className="flex-1"
              />
              <span className="text-[10px] font-medium text-muted-foreground w-20 text-right">
                {levelLabels[skill.level]}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeSkill(skill.id)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" onClick={addSkill} className="gap-1.5 mt-1">
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Skill
      </Button>
    </div>
  );
}
