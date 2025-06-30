import { allergyList } from "@/data/allergens"
import { religiousRestrictionList } from "@/data/religiousRestrictions"
import type { AllergenId, ReligiousRestrictionId } from "@/types"
import { getDietaryRestrictions } from "@/utils/localStorage"

export function getInitDietaryRestrictions() {
  const storage = getDietaryRestrictions()

  const allergies = allergyList.reduce<Record<AllergenId, boolean>>(
    (acc, item) => {
      acc[item.id] = storage.allergies.includes(item.id)
      return acc
    },
    {} as Record<AllergenId, boolean>
  )

  const religious = religiousRestrictionList.reduce<Record<ReligiousRestrictionId, boolean>>(
    (acc, item) => {
      acc[item.id] = storage.religious.includes(item.id)
      return acc
    },
    {} as Record<ReligiousRestrictionId, boolean>
  )

  return {
    allergies,
    religious,
    other: storage.other || [],
  }
}
