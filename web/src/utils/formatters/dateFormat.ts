import { formatInTimeZone } from "date-fns-tz";

export default function dateFormat(
  date: string | Date,
  timezone: string,
  format: string = "yyyy-MM-dd HH:mm:ssXXX"
) {
  return formatInTimeZone(date, timezone, format);
}
