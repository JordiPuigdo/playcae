"use client";

import { ArrowLeft, ChevronRight, HardHat } from "lucide-react";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectDetailHeaderProps {
  projectName: string;
}

export const ProjectDetailHeader = ({ projectName }: ProjectDetailHeaderProps) => {
  const router = useRouter();

  return (
    <div className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <nav className="flex items-center gap-2 text-sm text-playBlueLight mb-4">
          <Link
            href="/dashboard/projects"
            className="hover:text-playBlueDark transition-colors"
          >
            Obras
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-playBlueDark font-medium">{projectName}</span>
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="h-6 w-px bg-border" />
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
            <HardHat className="h-7 w-7 text-playBlueDark" />
            {projectName}
          </h1>
        </div>
      </div>
    </div>
  );
};
