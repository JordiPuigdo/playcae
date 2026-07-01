import { z } from "zod";

export const normalizeHeader = (header: string): string =>
  header
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");

export const mapRecord = <TRow>(
  record: Record<string, unknown>,
  headerMap: Record<string, keyof TRow>,
  emptyRow: TRow
): TRow => {
  const row: TRow = { ...emptyRow };
  Object.entries(record).forEach(([key, value]) => {
    const field = headerMap[normalizeHeader(key)];
    if (field) {
      row[field] = (value == null ? "" : String(value).trim()) as TRow[keyof TRow];
    }
  });
  return row;
};

interface RowValidatorOptions<TRow> {
  schema: z.ZodType;
  normalize?: (row: TRow) => TRow;
  dedupe?: { key: (row: TRow) => string; message: string };
}

export const createRowValidator = <TRow extends { error?: string }>(
  options: RowValidatorOptions<TRow>
) => {
  return (rows: TRow[]): TRow[] => {
    const seen = new Set<string>();
    return rows.map((raw) => {
      const row = options.normalize ? options.normalize(raw) : raw;
      const result = options.schema.safeParse(row);
      if (!result.success) {
        return { ...row, error: result.error.issues[0]?.message };
      }
      if (options.dedupe) {
        const key = options.dedupe.key(row);
        if (seen.has(key)) {
          return { ...row, error: options.dedupe.message };
        }
        seen.add(key);
      }
      return { ...row, error: undefined };
    });
  };
};
