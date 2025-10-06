import { SupplementCategory } from "../state/appStore";

export interface CategoryInfo {
  id: SupplementCategory;
  name: string;
  color: string;
  bgColor: string;
  icon: string;
  description: string;
}

/**
 * Get all supplement categories with their metadata
 */
export const SUPPLEMENT_CATEGORIES: CategoryInfo[] = [
  {
    id: "vitamins",
    name: "Витамини",
    color: "#3b82f6", // blue
    bgColor: "#dbeafe",
    icon: "nutrition",
    description: "Витамини и минерали",
  },
  {
    id: "herbs",
    name: "Билки",
    color: "#22c55e", // green
    bgColor: "#dcfce7",
    icon: "leaf",
    description: "Билки и ботанически",
  },
  {
    id: "proteins",
    name: "Протеини",
    color: "#ef4444", // red
    bgColor: "#fee2e2",
    icon: "fitness",
    description: "Аминокиселини и протеини",
  },
  {
    id: "probiotics",
    name: "Пробиотици",
    color: "#f59e0b", // amber
    bgColor: "#fef3c7",
    icon: "analytics",
    description: "Ензими, метаболити и други",
  },
  {
    id: "multi",
    name: "Мулти",
    color: "#8b5cf6", // purple
    bgColor: "#ede9fe",
    icon: "apps",
    description: "Комбинирани или функционални",
  },
];

/**
 * Get category info by ID
 */
export function getCategoryInfo(categoryId: SupplementCategory): CategoryInfo {
  return SUPPLEMENT_CATEGORIES.find((cat) => cat.id === categoryId) || SUPPLEMENT_CATEGORIES[0];
}

/**
 * Get category name by ID
 */
export function getCategoryName(categoryId: SupplementCategory): string {
  return getCategoryInfo(categoryId).name;
}

/**
 * Get category color by ID
 */
export function getCategoryColor(categoryId: SupplementCategory): string {
  return getCategoryInfo(categoryId).color;
}

/**
 * Detect category from supplement name (basic heuristic)
 * In production, this should be AI-powered or from a database
 */
export function detectSupplementCategory(supplementName: string): SupplementCategory {
  const name = supplementName.toLowerCase();

  // Vitamins and minerals
  if (
    name.includes("vitamin") ||
    name.includes("витамин") ||
    name.includes("calcium") ||
    name.includes("калций") ||
    name.includes("магнезий") ||
    name.includes("magnesium") ||
    name.includes("zinc") ||
    name.includes("цинк") ||
    name.includes("железо") ||
    name.includes("iron") ||
    name.includes("d3") ||
    name.includes("b12") ||
    name.includes("c ")
  ) {
    return "vitamins";
  }

  // Herbs and botanicals
  if (
    name.includes("женшен") ||
    name.includes("ginseng") ||
    name.includes("ехинацея") ||
    name.includes("echinacea") ||
    name.includes("куркума") ||
    name.includes("turmeric") ||
    name.includes("ashwagandha") ||
    name.includes("ашваганда") ||
    name.includes("зелен чай") ||
    name.includes("green tea") ||
    name.includes("garcinia") ||
    name.includes("гарциния")
  ) {
    return "herbs";
  }

  // Proteins and amino acids
  if (
    name.includes("protein") ||
    name.includes("протеин") ||
    name.includes("bcaa") ||
    name.includes("бцаа") ||
    name.includes("amino") ||
    name.includes("амино") ||
    name.includes("creatine") ||
    name.includes("креатин") ||
    name.includes("glutamine") ||
    name.includes("глутамин") ||
    name.includes("leucine") ||
    name.includes("лейцин") ||
    name.includes("whey") ||
    name.includes("суроватка")
  ) {
    return "proteins";
  }

  // Probiotics and metabolites
  if (
    name.includes("probiotic") ||
    name.includes("пробиотик") ||
    name.includes("omega") ||
    name.includes("омега") ||
    name.includes("fish oil") ||
    name.includes("рибено масло") ||
    name.includes("коензим") ||
    name.includes("coenzyme") ||
    name.includes("enzyme") ||
    name.includes("ензим") ||
    name.includes("collagen") ||
    name.includes("колаген")
  ) {
    return "probiotics";
  }

  // Multi-vitamins and combined
  if (
    name.includes("multi") ||
    name.includes("мулти") ||
    name.includes("комплекс") ||
    name.includes("complex") ||
    name.includes("stack") ||
    name.includes("формула") ||
    name.includes("formula") ||
    name.includes("complete") ||
    name.includes("пълен")
  ) {
    return "multi";
  }

  // Default to vitamins
  return "vitamins";
}
