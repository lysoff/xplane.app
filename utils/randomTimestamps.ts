import { DateTime } from "luxon";

export const randomTimestamps = () => {
  const start = DateTime.now().startOf("day");
  const end = DateTime.now().endOf("day");
  const diff = end.toMillis() - start.toMillis();

  const array = [];

  for (let i = 0; i < 10; i++) {
    array.push(
      DateTime.fromMillis(
        start.toMillis() + Math.trunc(Math.random() * diff)
      ).toJSDate()
    );
  }

  array.sort((a, b) => (a > b ? 1 : -1));

  return {
    start: start.toJSDate(),
    end: end.toJSDate(),
    diff,
    array,
  };
};
