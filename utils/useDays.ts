import { DataPoint } from "@/components/charts/WeekChart";

const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const daysOfTheWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const days: DataPoint[] = [];
for (let i = 0; i < 200; i++) {
  days.push({
    label: labels[i % 7],
    day: daysOfTheWeek[i % 7],
    value: Math.trunc(Math.random() * 150),
  });
}

export const useDays = () => days;
