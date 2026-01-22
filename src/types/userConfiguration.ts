import { BaseEntity } from "./baseEntity";

export interface UserConfiguration extends BaseEntity {
  userId: string;
  logoUrl: string | null;
  updatedAt: string;
}

export interface UserConfigurationUpdate {
  logoUrl?: string | null;
}
