import { z } from "zod";
import { validateCompanyTaxId } from "@/app/utils/tax-id-validation";

export const companyImportRowSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "El email es obligatorio")
    .email("Formato de email no válido"),
  name: z.string().trim().optional().default(""),
  taxId: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine((value) => value === "" || validateCompanyTaxId(value), "CIF no válido"),
  contactPerson: z.string().trim().optional().default(""),
  phone: z.string().trim().optional().default(""),
});

export type CompanyImportRowSchema = z.infer<typeof companyImportRowSchema>;
