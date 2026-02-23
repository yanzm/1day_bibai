import fs from "fs";
import path from "path";
import { Spot, Event, SpotsData } from "@/types/spot";

const FILE_PATH = path.join(process.cwd(), "bibai-spots.json");

function readData(): SpotsData {
  const raw = fs.readFileSync(FILE_PATH, "utf-8");
  return JSON.parse(raw) as SpotsData;
}

function writeData(data: SpotsData): void {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2) + "\n");
}

export function readSpots(): Spot[] {
  return readData().spots;
}

export function writeSpots(spots: Spot[]): void {
  const data = readData();
  data.spots = spots;
  writeData(data);
}

export function readEvents(): Event[] {
  return readData().events;
}

export function writeEvents(events: Event[]): void {
  const data = readData();
  data.events = events;
  writeData(data);
}
