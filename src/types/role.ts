export interface Permission {
  id?: string;
  code: string;
  description: string;
  category?: string | null;
}

export interface Role {
  id?: string;
  name: string;
  description?: string | null;
  adminUserId?: string | null;
  isSystem: boolean;
  permissionCodes: string[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string | null;
  permissionCodes: string[];
}

export interface UpdateRoleRequest {
  name: string;
  description?: string | null;
  permissionCodes: string[];
}

export interface WorkerRoles {
  workerId: string;
  roles: Role[];
}

export interface WorkerMobileAccess {
  workerId: string;
  hasAccess: boolean;
  mustChangePassword: boolean;
  gpsRequired: boolean;
}

export interface SetWorkerMobileAccessRequest {
  password: string;
  gpsRequired: boolean;
  mustChangePassword: boolean;
}
