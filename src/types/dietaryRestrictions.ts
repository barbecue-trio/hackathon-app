export type UserDietaryRestrictions = {
  allergies: string[]
  religiousRestrictions: string[]
  otherRestrictions: string[]
}

export type DietaryRestrictionGroupKey = keyof UserDietaryRestrictions
