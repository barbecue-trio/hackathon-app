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
// 統合型定義システムから宗教的制約情報をインポート
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

  // Dietary Restrictions state - 宗教的制約のみ
  const [dietaryRestrictions, setDietaryRestrictions] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {}

    // 宗教的制約項目を追加
    for (const restriction of religiousRestrictionList) {
      initialState[restriction.name] = false
    }

    return initialState
  })

  // Menu items state
  const [menuItems, setMenuItems] = useState<MenuItemType[]>([])
  const [isLoadingMenu, setIsLoadingMenu] = useState(true)

  // アップロードされた画像の情報をログ出力
  useEffect(() => {
    if (state?.uploadedImage) {
      console.log("アップロードされた画像URL:", state.uploadedImage)
      console.log("アップロードされた画像パス:", state.imagePath)
    }
  }, [state])

  // メニューデータを取得
  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        setIsLoadingMenu(true)

        // ローカルストレージからメニューコレクションIDを取得
        const documentId = getMenuCollectionId() || ""

        console.log("documentId:", documentId)

        if (!documentId) {
          console.warn("メニューコレクションIDが見つかりません")
          setMenuItems([])
          return
        }

        // 新しいFirestoreサービスを使用してメニューコレクションを取得
        const menuCollection = await getMenuCollection(documentId)
        console.log("取得したメニューコレクション:", menuCollection)

        if (menuCollection && menuCollection.menus.length > 0) {
          setMenuItems(menuCollection.menus)
          console.log("取得したメニューアイテム:", menuCollection.menus)
        } else {
          console.warn("メニューアイテムが見つかりません")
          setMenuItems([])
        }
      } catch (error) {
        console.error("メニューデータの取得に失敗しました:", error)
        setMenuItems([])
      } finally {
        setIsLoadingMenu(false)
      }
    }

    fetchMenuData()
  }, [state?.menuCollectionId])

  // チェックされた宗教的制約に基づいてメニューをフィルタリング
  const filteredMenuItems = useMemo(() => {
    // チェックされた宗教的制約のIDリストを取得
    const selectedRestrictionIds = Object.entries(dietaryRestrictions)
      .filter(([_, checked]) => checked)
      .map(([restrictionName, _]) => religiousRestrictionNameToIdMap[restrictionName])
      .filter((id) => id !== undefined)

    console.log("選択された宗教的制約ID:", selectedRestrictionIds)

    // 選択された制約がない場合は全てのメニューを表示
    if (selectedRestrictionIds.length === 0) {
      return menuItems
    }

    // 選択された宗教的制約を含むメニューを除外
    const filtered = menuItems.filter((item) => {
      const hasRestrictedIngredients = item.dietary_restriction_ids.some((id) =>
        selectedRestrictionIds.includes(id)
      )
      return !hasRestrictedIngredients
    })

    console.log("フィルタリング前のメニュー数:", menuItems.length)
    console.log("フィルタリング後のメニュー数:", filtered.length)

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

          {/* アップロードされた画像が存在する場合の表示（デバッグ用） */}
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
                アップロードされた画像：
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

              {/* 画像詳細情報 */}
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
                  <strong>パス:</strong> {state.imagePath}
                </Typography>

                {state.fileSize && (
                  <Typography
                    sx={{
                      fontFamily: '"Spline Sans", "Roboto", sans-serif',
                      fontSize: 12,
                      color: "#666",
                    }}
                  >
                    <strong>ファイルサイズ:</strong> {(state.fileSize / 1024 / 1024).toFixed(2)} MB
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
                    <strong>ファイル形式:</strong> {state.contentType}
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
                  ※ この画像がOCRとAI解析の対象となります
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
              Menu Items {isLoadingMenu ? "(読み込み中...)" : `(${filteredMenuItems.length}件)`}
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
                  メニューデータを読み込み中...
                </Typography>
              </Box>
            ) : filteredMenuItems.length > 0 ? (
              filteredMenuItems.map((item) => {
                // 元のメニュー配列でのインデックスを取得
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
                  選択された宗教的制約に適合するメニューが見つかりませんでした
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 14,
                    color: "#999",
                    textAlign: "center",
                  }}
                >
                  フィルター条件を変更してください
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
                  メニューデータが見つかりませんでした
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
