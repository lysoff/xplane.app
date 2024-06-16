import { DateTime } from "luxon";

export const randomTimestamps = () => {
  const start = DateTime.now().startOf("day").toMillis();
  const end = DateTime.now().endOf("day").toMillis();
  const diff = end - start;

  const array = [];

  for (let i = 0; i < 10; i++) {
    array.push(start + Math.trunc(Math.random() * diff));
  }

  return {
    start,
    end,
    diff,
    array,
  };
};
