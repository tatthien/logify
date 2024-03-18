import dayjs from "dayjs";

export function formatDate(d: Date | string, template = "DD MMM YYYY") {
  return dayjs(d).format(template);
}
