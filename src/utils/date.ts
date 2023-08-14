import { format, parseISO } from "date-fns";

export enum DateFormat {
  Date = "yyyy-MM-dd", // Y4MD format
  DateTime = "yyyy-MM-dd HH:mm:ss"
}

/**
 * Given a date it formats the date to a string.
 *  - If `includeTime` is `true` the output format is `"YYYY-MM-DD HH:mm:ss"`.
 *    Example: `2023-05-19 15:22:27`
 *  - Otherwise, the output format is `"YYYY-MM-DD"`
 *    Example: `2023-05-19`
 * @param date The date to format to string
 * @param includeTime If should include hours, minutes and seconds
 * @returns The date formatted to a string
 */
export const fromDateToString = (date: Date, includeTime: boolean) =>
  includeTime
    ? format(date, DateFormat.DateTime)
    : format(date, DateFormat.Date);

/**
 * Given a string that represents a date, it formats the string to a date of ISO format.
 * @param dateString String that represents a date
 * @param format Format to parse the string to a date
 * @returns The string formatted to a date of ISO format
 */
export const fromStringToDateISO = (dateString: string) => parseISO(dateString);

/**
 * Given two strings that represent dates, calculate the difference in days
 * @param startDate ISO string format that represent the mayor date
 * @param endDate ISO string format that represent the minor date
 * @returns The number of days between the both params
 */
export const calculateDateDifference = (
  startDate: string | Date,
  endDate: string | Date
) => {
  const start = (
    typeof startDate === "string" ? new Date(startDate) : startDate
  ).getTime();
  const end = (
    typeof endDate === "string" ? new Date(endDate) : endDate
  ).getTime();

  const timeDifference = end - start;

  const differenceInDays = timeDifference / (1000 * 60 * 60 * 24);
  return Math.abs(Math.round(differenceInDays));
};
