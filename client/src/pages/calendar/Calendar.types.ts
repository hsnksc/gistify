import type { CalendarImportance } from "@shared/calendar";

export type EventFilter = CalendarImportance | "all";
export type EventSort = "time" | "importance" | "country";
