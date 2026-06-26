import { z } from "zod";
import { validatePersonId } from "@/app/utils/tax-id-validation";

export const internalWorkerRowSchema = z.object({
  firstName: z.string().trim().min(1, "El nombre es obligatorio"),
  lastName: z.string().trim().min(1, "Los apellidos son obligatorios"),
  cardId: z
    .string()
    .trim()
    .min(1, "El DNI/NIE es obligatorio")
    .refine((value) => validatePersonId(value), "Formato de DNI/NIE no válido"),
  ssn: z.string().trim().optional().default(""),
  position: z.string().trim().optional().default(""),
  email: z
    .string()
    .trim()
    .email("Formato de email no válido")
    .optional()
    .or(z.literal("")),
});

export type InternalWorkerRow = z.infer<typeof internalWorkerRowSchema>;
