"use client";

import { useResume } from "@/lib/resume-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HugeiconsIcon } from "@hugeicons/react";
import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";

export function CertificationsForm() {
  const { data, addCertification, updateCertification, removeCertification } =
    useResume();

  return (
    <div className="flex flex-col gap-4">
      {data.certifications.map((cert, idx) => (
        <div key={cert.id} className="flex flex-col gap-3">
          {idx > 0 && <Separator className="my-1" />}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Certification {idx + 1}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeCertification(cert.id)}
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
            >
              <HugeiconsIcon icon={Delete02Icon} size={15} />
            </Button>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label className="text-xs font-medium text-muted-foreground">
              Certification Name
            </Label>
            <Input
              value={cert.name}
              onChange={(e) =>
                updateCertification(cert.id, { name: e.target.value })
              }
              placeholder="e.g. AWS Certified Developer"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Issuer
              </Label>
              <Input
                value={cert.issuer}
                onChange={(e) =>
                  updateCertification(cert.id, { issuer: e.target.value })
                }
                placeholder="Issuing organization"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs font-medium text-muted-foreground">
                Date
              </Label>
              <Input
                type="month"
                value={cert.date}
                onChange={(e) =>
                  updateCertification(cert.id, { date: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addCertification}
        className="gap-1.5 mt-1"
      >
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Certification
      </Button>
    </div>
  );
}

export function LanguagesForm() {
  const { data, addLanguage, updateLanguage, removeLanguage } = useResume();

  return (
    <div className="flex flex-col gap-3">
      {data.languages.map((lang) => (
        <div key={lang.id} className="flex items-center gap-2">
          <Input
            value={lang.name}
            onChange={(e) => updateLanguage(lang.id, { name: e.target.value })}
            placeholder="Language"
            className="h-8 text-sm flex-1"
          />
          <Select
            value={lang.proficiency}
            onValueChange={(val) =>
              updateLanguage(lang.id, {
                proficiency: val as typeof lang.proficiency,
              })
            }
          >
            <SelectTrigger className="h-8 text-xs w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="native">Native</SelectItem>
              <SelectItem value="fluent">Fluent</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeLanguage(lang.id)}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
          >
            <HugeiconsIcon icon={Delete02Icon} size={14} />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={addLanguage}
        className="gap-1.5 mt-1"
      >
        <HugeiconsIcon icon={Add01Icon} size={15} />
        Add Language
      </Button>
    </div>
  );
}
