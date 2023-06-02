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
