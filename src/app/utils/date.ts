import dayjs from "dayjs";

export const MIN_DATE = "0001-01-01T00:00:00";

const isMinDate = (dateString: string) => dayjs(dateString).year() === 1;

export const formatDate = (dateString?: string): string => {
  if (!dateString || dateString === MIN_DATE || isMinDate(dateString)) return "-";
  return dayjs(dateString).format("DD/MM/YYYY");
};

export const isExpiringSoon = (expiryDate?: string): boolean => {
  if (!expiryDate || expiryDate === MIN_DATE || isMinDate(expiryDate)) return false;
  const diffDays = dayjs(expiryDate).startOf("day").diff(dayjs().startOf("day"), "day");
  return diffDays <= 30 && diffDays > 0;
};

export const isExpired = (expiryDate?: string): boolean => {
  if (!expiryDate || expiryDate === MIN_DATE || isMinDate(expiryDate)) return false;
  return dayjs(expiryDate).startOf("day").isBefore(dayjs().startOf("day"));
};
