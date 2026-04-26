"use client";

import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectList, ProjectStatus } from "@/types/project";

interface ProjectRowActionsProps {
  project: ProjectList;
  onEdit: (project: ProjectList) => void;
  onCancel: (project: ProjectList) => void;
}

export const ProjectRowActions = ({ project, onEdit, onCancel }: ProjectRowActionsProps) => {
  if (project.status !== ProjectStatus.Active) return null;

  return (
    <div
      className="flex justify-end gap-2"
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        variant="outline"
        size="sm"
        onClick={() => onEdit(project)}
        className="gap-1"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onCancel(project)}
        className="gap-1 text-destructive hover:text-destructive"
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
