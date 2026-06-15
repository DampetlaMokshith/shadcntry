"use client";

import { useResume } from "@/lib/resume-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const accentColors = [
  { value: "#2563eb", label: "Blue", bg: "bg-blue-600" },
  { value: "#0f766e", label: "Teal", bg: "bg-teal-700" },
  { value: "#7c3aed", label: "Violet", bg: "bg-violet-600" },
  { value: "#be185d", label: "Rose", bg: "bg-rose-700" },
  { value: "#ea580c", label: "Orange", bg: "bg-orange-600" },
  { value: "#059669", label: "Emerald", bg: "bg-emerald-600" },
  { value: "#4f46e5", label: "Indigo", bg: "bg-indigo-600" },
  { value: "#0284c7", label: "Sky", bg: "bg-sky-600" },
  { value: "#18181b", label: "Neutral", bg: "bg-neutral-900" },
  { value: "#dc2626", label: "Red", bg: "bg-red-600" },
];

export function StyleControls() {
  const { styles, updateStyles } = useResume();

  return (
    <div className="flex flex-col gap-5">
      {/* Layout */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Layout</Label>
        <div className="flex gap-1.5">
          {([
            { value: "classic" as const, label: "Classic" },
            { value: "sidebar" as const, label: "Sidebar" },
            { value: "modern" as const, label: "Modern" },
          ]).map((l) => (
            <Button
              key={l.value}
              variant={styles.layout === l.value ? "default" : "outline"}
              size="sm"
              onClick={() => updateStyles({ layout: l.value })}
              className="flex-1 text-xs h-8"
            >
              {l.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Accent Color */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Accent Color</Label>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color.value}
              onClick={() => updateStyles({ accentColor: color.value })}
              className={`h-7 w-7 rounded-full border-2 transition-all duration-150 ${
                styles.accentColor === color.value
                  ? "border-foreground scale-110 ring-2 ring-offset-2 ring-offset-background ring-foreground/20"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: color.value }}
              title={color.label}
            />
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Font Size</Label>
        <div className="flex gap-1.5">
          {(["small", "medium", "large"] as const).map((size) => (
            <Button
              key={size}
              variant={styles.fontSize === size ? "default" : "outline"}
              size="sm"
              onClick={() => updateStyles({ fontSize: size })}
              className="flex-1 capitalize text-xs h-8"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Line Height</Label>
        <Select
          value={styles.lineHeight}
          onValueChange={(val) =>
            updateStyles({ lineHeight: val as typeof styles.lineHeight })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="relaxed">Relaxed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Section Spacing */}
      <div className="flex flex-col gap-2">
        <Label className="text-xs font-medium text-muted-foreground">Section Spacing</Label>
        <Select
          value={styles.sectionSpacing}
          onValueChange={(val) =>
            updateStyles({
              sectionSpacing: val as typeof styles.sectionSpacing,
            })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="compact">Compact</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="spacious">Spacious</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
