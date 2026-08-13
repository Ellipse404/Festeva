import { EventCategory } from "./events";

export interface CategoryOption {
  id: EventCategory;
  label: string;
  selectLabel: string;
}

export interface PresetPoster {
  label: string;
  url: string;
}
