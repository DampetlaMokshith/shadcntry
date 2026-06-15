import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Templates — ResumeForge",
  description:
    "Choose from professionally designed resume templates. Start with a blank canvas or pick a template to customize in our real-time editor.",
};

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
