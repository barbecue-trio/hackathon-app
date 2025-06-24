import {
  Button,
  Checkbox,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { Fragment, useState } from "react"
import { dietaryRestrictionGroups } from "../data/dietaryRestrictionGroups"
import type { UserDietaryRestrictions } from "../types/dietaryRestrictions"

function DietaryRestrictions() {
  const [userDietaryRestrictions, setUserDietaryRestrictions] = useState<UserDietaryRestrictions>({
    allergies: [],
    religiousRestrictions: [],
    otherRestrictions: [],
  })

  const handleToggle = (groupKey: keyof UserDietaryRestrictions, option: string) => {
    setUserDietaryRestrictions((prev) => {
      const currentGroup = prev[groupKey]
      const newGroup = currentGroup.includes(option)
        ? currentGroup.filter((item) => item !== option)
        : [...currentGroup, option]

      return { ...prev, [groupKey]: newGroup }
    })
  }

  const handleSave = () => {
    localStorage.setItem("dietaryRestrictions", JSON.stringify(userDietaryRestrictions))
  }

  return (
    <div>
      <h1>Dietary Restrictions</h1>
      <List>
        {dietaryRestrictionGroups.map((group) => (
          <Fragment key={group.key}>
            <Typography
              variant="h3"
              sx={{ textAlign: "left" }}
              fontSize={18}
              fontWeight="bold"
              my={2}
            >
              {group.label}
            </Typography>
            {group.options.map((option) => (
              <ListItemButton key={option} onClick={() => handleToggle(group.key, option)}>
                <ListItemIcon>
                  <Checkbox checked={userDietaryRestrictions[group.key].includes(option)} />
                </ListItemIcon>
                <ListItemText primary={option} />
              </ListItemButton>
            ))}
          </Fragment>
        ))}
      </List>
      <Button type="button" onClick={handleSave}>
        save
      </Button>
    </div>
  )
}

export default DietaryRestrictions
