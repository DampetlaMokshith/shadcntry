"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ResumeProvider } from "@/lib/resume-context";
import { EditorPanel } from "@/components/resume/editor-panel";
import { ResumePreview } from "@/components/resume/resume-preview";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SidebarLeft01Icon,
  EyeIcon,
  Edit02FreeIcons,
  FileDownloadFreeIcons,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from "@hugeicons/core-free-icons";
import { getTemplateById } from "@/lib/resume-templates";

export default function ResumeEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-muted/40">
        <div className="animate-pulse text-muted-foreground text-sm">Loading editor...</div>
      </div>
    }>
      <EditorContent />
    </Suspense>
  );
}

function EditorContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const template = useMemo(
    () => (templateId ? getTemplateById(templateId) : undefined),
    [templateId]
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileView, setMobileView] = useState<"editor" | "preview">("editor");
  const [zoom, setZoom] = useState(0.65);

  return (
    <ResumeProvider
      initialData={template?.data}
      initialStyles={template?.styles}
    >
      <div className="flex flex-col h-screen bg-muted/40 print:block print:h-auto print:bg-white">
        {/* Top toolbar — hidden on print */}
        <header className="h-12 border-b border-border bg-background flex items-center justify-between px-3 gap-2 shrink-0 z-10 print:hidden">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle (desktop) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="hidden md:flex h-8 w-8 p-0"
                >
                  <HugeiconsIcon icon={SidebarLeft01Icon} size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Toggle sidebar</TooltipContent>
            </Tooltip>

            <div className="flex items-center gap-1.5">
              <div className="h-6 w-6 rounded-md flex items-center justify-center bg-primary">
                <span className="text-[10px] font-bold text-primary-foreground">RF</span>
              </div>
              <span className="text-sm font-semibold tracking-tight hidden sm:inline">ResumeForge</span>
            </div>
          </div>

          {/* Mobile toggle */}
          <div className="flex md:hidden gap-1">
            <Button
              variant={mobileView === "editor" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobileView("editor")}
              className="h-8 gap-1 text-xs"
            >
              <HugeiconsIcon icon={Edit02FreeIcons} size={14} />
              Edit
            </Button>
            <Button
              variant={mobileView === "preview" ? "default" : "ghost"}
              size="sm"
              onClick={() => setMobileView("preview")}
              className="h-8 gap-1 text-xs"
            >
              <HugeiconsIcon icon={EyeIcon} size={14} />
              Preview
            </Button>
          </div>

          {/* Right toolbar */}
          <div className="flex items-center gap-1">
            {/* Zoom controls (desktop) */}
            <div className="hidden md:flex items-center gap-0.5 mr-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom((z) => Math.max(0.35, z - 0.1))}
                    className="h-7 w-7 p-0"
                  >
                    <HugeiconsIcon icon={ZoomOutAreaIcon} size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom out</TooltipContent>
              </Tooltip>
              <span className="text-[10px] font-mono text-muted-foreground w-8 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom((z) => Math.min(1.2, z + 0.1))}
                    className="h-7 w-7 p-0"
                  >
                    <HugeiconsIcon icon={ZoomInAreaIcon} size={15} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">Zoom in</TooltipContent>
              </Tooltip>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => window.print()}
                >
                  <HugeiconsIcon icon={FileDownloadFreeIcons} size={15} />
                  <span className="hidden sm:inline">Download PDF</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Print / Save as PDF</TooltipContent>
            </Tooltip>
          </div>
        </header>

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden print:block print:overflow-visible">
          {/* Left editor panel — desktop sidebar — hidden on print */}
          <div
            className={`hidden md:flex border-r border-border bg-background transition-all duration-200 ease-out overflow-hidden shrink-0 print:!hidden ${
              sidebarOpen ? "w-[380px]" : "w-0"
            }`}
          >
            <div className="w-[380px] h-full">
              <EditorPanel />
            </div>
          </div>

          {/* Mobile editor — hidden on print */}
          <div
            className={`md:hidden w-full h-full print:!hidden ${
              mobileView === "editor" ? "block" : "hidden"
            }`}
          >
            <EditorPanel />
          </div>

          {/* Preview area */}
          <div
            className={`flex-1 md:block print:!block print:overflow-visible ${
              mobileView === "preview" ? "block" : "hidden"
            }`}
          >
            <ScrollArea className="h-full print:!overflow-visible print:[&>div]:!overflow-visible cursor-grab active:cursor-grabbing">
              <div
                className="flex justify-center py-6 px-4 min-h-full print:!block print:!p-0 print:!bg-white print:!min-h-0"
                style={{ background: "repeating-conic-gradient(oklch(0.94 0 0) 0% 25%, transparent 0% 50%) 50% / 16px 16px" }}
              >
                <div
                  className="print:!transform-none"
                  style={{
                    transform: `scale(${zoom})`,
                    transformOrigin: "top center",
                    transition: "transform 150ms ease-out",
                  }}
                >
                  <ResumePreview />
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </ResumeProvider>
  );
}

