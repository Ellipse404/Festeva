import { EventCategory, CategoryOption } from "../types";

export const CATEGORIES: CategoryOption[] = [
  { id: "all", label: "✨ All Events", selectLabel: "✨ All Events" },
  { id: "birthday", label: "🎂 Birthday", selectLabel: "🎂 Birthday Party" },
  { id: "reception", label: "💍 Reception", selectLabel: "💍 Wedding Reception" },
  {
    id: "rice_ceremony",
    label: "🍚 Rice Ceremony",
    selectLabel: "🍚 Rice Ceremony (Annaprashan)",
  },
  {
    id: "anniversary",
    label: "🥂 Anniversary",
    selectLabel: "🥂 Anniversary Celebration",
  },
  {
    id: "others",
    label: "🎈 Others",
    selectLabel: "🎈 Others / Special Gatherings",
  },
];

export const HOST_CATEGORIES = CATEGORIES.filter(
  (c): c is CategoryOption & { id: Exclude<EventCategory, "all"> } =>
    c.id !== "all",
);
