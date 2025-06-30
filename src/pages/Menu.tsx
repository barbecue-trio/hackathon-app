import { Box, Typography } from "@mui/material"
import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import type { MenuItem as MenuItemType } from "../../types"
import { religiousRestrictionNameToIdMap } from "../../types/religious"
// Vite static asset import
import menuItemImg from "../assets/images/menu-item-image.png"
import CheckItem from "../components/CheckItem"
import Footer from "../components/Footer"
import Header from "../components/Header"
import MenuItem from "../components/MenuItem"
// Import religious restriction information from unified type definition system
import { religiousRestrictionList } from "../data/religiousRestrictions"
import { getMenuCollection } from "../services/firestoreService"
import { getMenuCollectionId } from "../utils/localStorage"

interface LocationState {
  uploadedImage?: string
  imagePath?: string
  fileSize?: number
  contentType?: string
  menuCollectionId?: string
  menuCount?: number
}

function Menu() {
  const location = useLocation()
  const state = location.state as LocationState

  // Dietary Restrictions state - religious restrictions only
  const [dietaryRestrictions, setDietaryRestrictions] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}

    // Add religious restriction items
    for (const restriction of religiousRestrictionList) {
      initialState[restriction.name] = false
    }

    return initialState
  })

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)

  // Log uploaded image information
  useEffect(() => {
    if (state?.uploadedImage) {
      console.log("Uploaded image URL:", state.uploadedImage)
      console.log("Uploaded image path:", state.imagePath)
    }
  }, [state])

  // Fetch menu data
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoadingMenu(true)

        // Get menu collection ID from localStorage
        const documentId = getMenuCollectionId() || ""

        console.log("documentId:", documentId)

        if (!documentId) {
          console.warn("Menu collection ID not found")
          setMenuItems([])
          return
        }

        // Use new Firestore service to get menu collection
        const menuCollection = await getMenuCollection(documentId)
        console.log("Retrieved menu collection:", menuCollection)

        if (menuCollection && menuCollection.menus.length > 0) {
          setMenuItems(menuCollection.menus)
          console.log("Retrieved menu items:", menuCollection.menus)
        } else {
          console.warn("Menu items not found")
          setMenuItems([])
        }
      } catch (error) {
        console.error("Failed to fetch menu data:", error)
        setMenuItems([])
      } finally {
        setIsLoadingMenu(false)
      }
    }

    fetchMenuData()
  }, [])

  // Filter menu items based on checked religious restrictions
  const filteredMenuItems = useMemo(() => {
    // Get list of checked religious restriction IDs
    const selectedRestrictionIds = Object.entries(dietaryRestrictions)
      .filter(([_, checked]) => checked)
      .map(([restrictionName, _]) => religiousRestrictionNameToIdMap[restrictionName])
      .filter((id) => id !== undefined)

    console.log("Selected religious restriction IDs:", selectedRestrictionIds)

    // If no restrictions are selected, show all menus
    if (selectedRestrictionIds.length === 0) {
      return menuItems
    }

    // Exclude menus containing selected religious restrictions
    const filtered = menuItems.filter((item) => {
      const hasRestrictedIngredients = item.dietary_restriction_ids.some((id) =>
        selectedRestrictionIds.includes(id)
      )
      return !hasRestrictedIngredients
    })

    console.log("Menu items before filtering:", menuItems.length)
    console.log("Menu items after filtering:", filtered.length)

    return filtered
  }, [menuItems, dietaryRestrictions])

  const handleDietaryChange = (restriction: string, checked: boolean) => {
    setDietaryRestrictions((prev) => ({
      ...prev,
      [restriction]: checked,
    }))
  }

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Main Content */}
        <Box className="main-content with-footer scrollable">
          {/* Header */}
          <Header title="Menu Analysis" />

          {/* Display uploaded image if present (for debugging) */}
          {state?.uploadedImage && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                padding: "16px",
                backgroundColor: "#f8f9fa",
                margin: "0 16px 16px",
                borderRadius: "8px",
                border: "1px solid #e1e5e9",
              }}
            >
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 600,
                  fontSize: 14,
                  color: "#121217",
                  marginBottom: "8px",
                }}
              >
                Uploaded Image:
              </Typography>
              <Box
                component="img"
                src={state.uploadedImage}
                alt="Uploaded menu"
                sx={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "contain",
                  borderRadius: "4px",
                  border: "1px solid #ddd",
                  marginBottom: "8px",
                }}
              />

              {/* Image details */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 12,
                    color: "#666",
                    wordBreak: "break-all",
                  }}
                >
                  <strong>Path:</strong> {state.imagePath}
                </Typography>

                {state.fileSize && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>File Size:</strong> {(state.fileSize / 1024 / 1024).toFixed(2)} MB
                  </Typography>
                )}

                {state.contentType && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>File Type:</strong> {state.contentType}
                  </Typography>
                )}

                {state.menuCollectionId && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>Menu Collection ID:</strong> {state.menuCollectionId}
                  </Typography>
                )}

                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 11,
                    color: "#999",
                    marginTop: "4px",
                    fontStyle: "italic",
                  }}
                >
                  ※ This image is subject to OCR and AI analysis
                </Typography>
              </Box>
            </Box>
          )}

          {/* Dietary Restrictions Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 12px",
                sm: "20px 16px 12px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "20px",
                  sm: "22px",
                },
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Dietary Restrictions
            </Typography>
          </Box>

          {/* Dietary Restrictions Check Items */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "0px 16px",
              width: "100%",
            }}
          >
            {religiousRestrictionList.map((restriction) => (
              <CheckItem
                key={restriction.name}
                label={restriction.name}
                checked={dietaryRestrictions[restriction.name] || false}
                onChange={(newChecked) => handleDietaryChange(restriction.name, newChecked)}
              />
            ))}
          </Box>

          {/* Menu Items Section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: {
                xs: "16px 16px 12px",
                sm: "20px 16px 12px",
              },
              width: "100%",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 700,
                fontSize: {
                  xs: "20px",
                  sm: "22px",
                },
                lineHeight: "1.2727272727272727em",
                textAlign: "left",
                color: "#121217",
                width: "100%",
              }}
            >
              Menu Items {isLoadingMenu ? "(Loading...)" : `(${filteredMenuItems.length} items)`}
            </Typography>
          </Box>

          {/* Loading or Menu Items List */}
          <Box
            sx={{
              width: "100%",
              backgroundColor: "#FFFFFF",
            }}
          >
            {isLoadingMenu ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 16px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 16,
                    color: "#666",
                  }}
                >
                  Loading menu data...
                </Typography>
              </Box>
            ) : filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => {
                // Get the index in the original menu array
                const originalIndex = menuItems.findIndex((menuItem) => menuItem.name === item.name)
                return (
                  <MenuItem
                    key={item.name}
                    title={item.name}
                    ingredients={item.ingredients.join(", ")}
                    imageSrc={menuItemImg}
                    index={originalIndex}
                  />
                )
              })
            ) : menuItems.length > 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 16px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 16,
                    color: "#666",
                    textAlign: "center",
                    marginBottom: "8px",
                  }}
                >
                  No menu items found that match your selected religious restrictions
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 14,
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  Please change your filter conditions
                </Typography>
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "40px 16px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 16,
                    color: "#666",
                  }}
                >
                  No menu data found
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  )
}

export default Menu
