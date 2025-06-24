import type { DietaryRestrictionGroupKey } from "../types/dietaryRestrictions"

export const dietaryRestrictionGroups: {
  key: DietaryRestrictionGroupKey
  label: string
  options: string[]
}[] = [
  {
    key: "allergies",
    label: "Allergies",
    options: ["Peanuts", "Tree Nuts", "Milk", "Eggs", "Fish"],
  },
  {
    key: "religiousRestrictions",
    label: "Religious Restrictions",
    options: ["Vegetarian", "Halal", "Kosher"],
  },
  {
    key: "otherRestrictions",
    label: "Other Restrictions",
    options: ["Vegan", "Gluten-Free", "Low-Carb"],
  },
]
