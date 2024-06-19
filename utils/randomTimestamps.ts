import { FieldType, Icons } from "@/components/charts/ScorePoint";
import { DateTime } from "luxon";

export const randomTimestamps = () => {
  const start = DateTime.now().startOf("day");
  const end = DateTime.now().endOf("day");
  const diff = end.toMillis() - start.toMillis();

  const array: Array<[Date, FieldType | undefined]> = [];

  for (let i = 0; i < 10; i++) {
    const timestamp = DateTime.fromMillis(
      start.toMillis() + Math.trunc(Math.random() * diff)
    ).toJSDate();

    const field = Object.keys(Icons)[
      Math.trunc(Math.random() * 3)
    ] as FieldType;

    array.push([timestamp, field]);
  }

  array.sort((a, b) => (a[0] > b[0] ? 1 : -1));

  return [
    [start.toJSDate(), undefined],
    ...array,
    [end.toJSDate(), undefined],
  ] as [Date, FieldType | undefined][];
};
