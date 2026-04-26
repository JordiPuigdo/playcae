import useSWR from "swr";
import {
  AssignCompanyToProjectData,
  CreateProjectData,
  Project,
  ProjectCompanyAssignment,
  ProjectList,
  UpdateProjectData,
} from "@/types/project";
import { ProjectService } from "@/services/project.service";
import { HttpClient } from "@/services/http-client";
import { ApiError } from "@/interfaces/api-response";
import { useAuthStore } from "./useAuthStore";

const projectService = new ProjectService(new HttpClient());

const PROJECTS_KEY = (adminUserId: string) => `/api/projects/admin/${adminUserId}`;

export const useProjects = () => {
  const { user } = useAuthStore();
  const adminUserId = user?.userId ?? "";

  const {
    data: projects = [],
    mutate,
    error: swrError,
    isValidating,
  } = useSWR<ProjectList[]>(
    adminUserId ? PROJECTS_KEY(adminUserId) : null,
    async () => {
      const response = await projectService.getAllByAdmin(adminUserId);
      return response.data ?? [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    }
  );

  const refreshProjects = () => mutate();

  const createProject = async (data: CreateProjectData): Promise<Project> => {
    const response = await projectService.create(data);
    await refreshProjects();
    return response.data;
  };

  const updateProject = async (id: string, data: UpdateProjectData): Promise<Project> => {
    const response = await projectService.update(id, data);
    await refreshProjects();
    return response.data;
  };

  const deleteProject = async (id: string): Promise<void> => {
    await projectService.delete(id);
    await refreshProjects();
  };

  const closeProject = async (id: string): Promise<void> => {
    await projectService.close(id);
    await refreshProjects();
  };

  const cancelProject = async (id: string): Promise<void> => {
    await projectService.cancel(id);
    await refreshProjects();
  };

  return {
    projects,
    isLoading: isValidating && projects.length === 0,
    error: swrError as ApiError | undefined,
    createProject,
    updateProject,
    deleteProject,
    closeProject,
    cancelProject,
    refreshProjects,
  };
};

const PROJECT_KEY = (id: string) => `/api/projects/${id}`;

export const useProject = (id: string) => {
  const {
    data: project = null,
    mutate,
    error: swrError,
    isValidating,
  } = useSWR<Project | null>(
    id ? PROJECT_KEY(id) : null,
    async () => {
      const response = await projectService.getById(id);
      return response.data ?? null;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    }
  );

  const refreshProject = () => mutate();

  const updateProject = async (data: UpdateProjectData): Promise<void> => {
    await projectService.update(id, data);
    await refreshProject();
  };

  const closeProject = async (): Promise<void> => {
    await projectService.close(id);
    await refreshProject();
  };

  const cancelProject = async (): Promise<void> => {
    await projectService.cancel(id);
    await refreshProject();
  };

  return {
    project,
    isLoading: isValidating && project === null && !swrError,
    error: swrError as ApiError | undefined,
    updateProject,
    closeProject,
    cancelProject,
    refreshProject,
  };
};

const ASSIGNMENTS_KEY = (projectId: string) => `/api/projects/${projectId}/assignments`;

export const useProjectAssignments = (projectId: string) => {
  const {
    data: assignments = [],
    mutate,
    isValidating,
  } = useSWR<ProjectCompanyAssignment[]>(
    projectId ? ASSIGNMENTS_KEY(projectId) : null,
    async () => {
      const response = await projectService.getAssignments(projectId);
      return response.data ?? [];
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const refreshAssignments = () => mutate();

  const assignCompany = async (data: AssignCompanyToProjectData): Promise<void> => {
    await projectService.assignCompany(projectId, data);
    await refreshAssignments();
  };

  const removeCompany = async (companyId: string): Promise<void> => {
    await projectService.removeCompany(projectId, companyId);
    await refreshAssignments();
  };

  const countCompaniesToRelease = async (): Promise<number> => {
    const response = await projectService.countCompaniesToRelease(projectId);
    return response.data ?? 0;
  };

  return {
    assignments,
    isLoading: isValidating && assignments.length === 0,
    assignCompany,
    removeCompany,
    countCompaniesToRelease,
    refreshAssignments,
  };
};
