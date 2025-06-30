import { Box, Skeleton, Typography } from "@mui/material";
import { getDownloadURL, ref } from "firebase/storage";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { MenuItem as MenuItemType } from "../../types";
import ramanDishMain from "../assets/images/ramen-dish-main.png";
import noodles from "../assets/noodles.jpeg";
import pot from "../assets/pot.jpeg";
import sashimi from "../assets/sashimi.jpeg";
import sushi from "../assets/sushi.jpeg";
import DietaryItem from "../components/DietaryItem";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { allergyIdMap } from "../data/allergens";
import { religiousRestrictionList } from "../data/religiousRestrictions";
import { storage } from "../firebase";
import { getMenuCollection } from "../services/firestoreService";
import { getMenuCollectionId } from "../utils/localStorage";
const FALLBACK_IMAGE = ramanDishMain;
const STORAGE_BASE_PATH =
  "gs://barbecue-trio.firebasestorage.app/menuItemImage";

const CATEGORY_IMAGES = {
  1: noodles,
  2: pot,
  3: sashimi,
  4: sushi,
} as const;

// Utility functions
const buildImageUrl = async (imageId: string): Promise<string> => {
  if (!imageId) return FALLBACK_IMAGE;

  try {
    const gsReference = ref(storage, `${STORAGE_BASE_PATH}/${imageId}`);
    const url = await getDownloadURL(gsReference);
    return url;
  } catch (error) {
    console.error("画像URL取得エラー:", error);
    return FALLBACK_IMAGE;
  }
};

const getCategoryImage = (categoryId: number): string | null => {
  return CATEGORY_IMAGES[categoryId as keyof typeof CATEGORY_IMAGES] || null;
};

const getAllergenNames = (allergyIds: number[]): string[] => {
  return allergyIds
    .map((id) => allergyIdMap[id])
    .filter((name) => name !== undefined);
};

const getDietaryRestrictionItems = (dietaryRestrictionIds: number[]) => {
  return religiousRestrictionList.map((restriction) => ({
    label: restriction.name,
    isSelected: dietaryRestrictionIds.includes(restriction.id),
  }));
};

// Check if required fields are empty
const isRequiredFieldsEmpty = (menuItem: MenuItemType): boolean => {
  return (
    !menuItem.name_jp ||
    !menuItem.category_id ||
    !menuItem.name ||
    !menuItem.image_id ||
    !menuItem.food_culture ||
    !menuItem.ingredients ||
    menuItem.ingredients.length === 0
  );
};

// Component styles
const styles = {
  container: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    padding: "12px 0px",
    width: "100%",
  },
  imageContainer: {
    display: "flex",
    justifyContent: "stretch",
    alignItems: "stretch",
    gap: "4px",
    width: "100%",
  },
  mainImage: {
    width: "100%",
    height: {
      xs: "200px",
      sm: "260px",
    },
    objectFit: "cover" as const,
    display: "block",
  },
  categoryImage: {
    width: "100%",
    height: {
      xs: "200px",
      sm: "250px",
    },
    objectFit: "contain" as const,
    display: "block",
    backgroundColor: "#F8F9FA",
  },
  section: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "10px",
    width: "100%",
  },
  sectionTitle: {
    display: "flex",
    flexDirection: "column" as const,
    padding: "16px 16px 8px",
    width: "100%",
  },
  sectionContent: {
    display: "flex",
    flexDirection: "column" as const,
    padding: "4px 16px 12px",
    width: "100%",
  },
  title: {
    fontFamily: '"Spline Sans", "Roboto", sans-serif',
    fontWeight: 700,
    fontSize: {
      xs: "20px",
      sm: "22px",
    },
    lineHeight: "1.2727272727272727em",
    textAlign: "left" as const,
    color: "#121217",
    width: "100%",
  },
  subtitle: {
    fontFamily: '"Spline Sans", "Roboto", sans-serif',
    fontWeight: 700,
    fontSize: {
      xs: "16px",
      sm: "18px",
    },
    lineHeight: "1.2777777777777777em",
    textAlign: "left" as const,
    color: "#121217",
    width: "100%",
  },
  body: {
    fontFamily: '"Spline Sans", "Roboto", sans-serif',
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "1.5em",
    textAlign: "left" as const,
    color: "#121217",
    width: "100%",
  },
  dietaryItemsContainer: {
    display: "flex",
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: "8px",
    width: "100%",
  },
};

function MenuDetail() {
  const [searchParams] = useSearchParams();

  const [menuItem, setMenuItem] = useState<MenuItemType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string>(FALLBACK_IMAGE);

  // Fetch image URL
  const fetchImageUrl = useCallback(async (imageId: string) => {
    if (!imageId) {
      setImageUrl(FALLBACK_IMAGE);
      return;
    }

    try {
      const url = await buildImageUrl(imageId);
      setImageUrl(url);
    } catch (error) {
      console.error("画像URL取得エラー:", error);
      setImageUrl(FALLBACK_IMAGE);
    }
  }, []);

  // Fetch menu detail data
  useEffect(() => {
    const fetchMenuDetail = async () => {
      try {
        setIsLoading(true);

        const documentId =
          searchParams.get("documentId") || getMenuCollectionId() || "";
        const indexStr = searchParams.get("index");
        const index = indexStr ? Number.parseInt(indexStr, 10) : -1;

        if (!documentId) {
          console.warn("メニューコレクションIDが見つかりません");
          setMenuItem(null);
          return;
        }

        if (index === -1) {
          console.warn("メニューアイテムのインデックスが見つかりません");
          setMenuItem(null);
          return;
        }

        const menuCollection = await getMenuCollection(documentId);

        if (menuCollection?.menus?.length > 0) {
          if (index >= 0 && index < menuCollection.menus.length) {
            const foundMenuItem = menuCollection.menus[index];
            setMenuItem(foundMenuItem);
            await fetchImageUrl(foundMenuItem.image_id);
          } else {
            console.warn(
              `指定されたインデックス ${index} のメニューアイテムが見つかりません。利用可能なインデックス: 0-${
                menuCollection.menus.length - 1
              }`
            );
            setMenuItem(null);
          }
        } else {
          console.warn("メニューアイテムが見つかりません");
          setMenuItem(null);
        }
      } catch (error) {
        console.error("メニュー詳細データの取得に失敗しました:", error);
        setMenuItem(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenuDetail();
  }, [searchParams, fetchImageUrl]);

  const categoryImage = menuItem
    ? getCategoryImage(menuItem.category_id)
    : null;

  // Render loading state
  if (isLoading) {
    return (
      <Box className="app-container">
        <Box className="page-container">
          <Box className="main-content with-footer scrollable">
            <Header title="読み込み中..." />
            <Typography sx={styles.body}>読み込み中...</Typography>
          </Box>
          <Footer />
        </Box>
      </Box>
    );
  }

  // Render error state
  if (!menuItem) {
    return (
      <Box className="app-container">
        <Box className="page-container">
          <Box className="main-content with-footer scrollable">
            <Header title="メニューが見つかりません" />
            <Typography sx={styles.body}>メニューが見つかりません</Typography>
          </Box>
          <Footer />
        </Box>
      </Box>
    );
  }

  // Check if required fields are empty
  const showSkeleton = isRequiredFieldsEmpty(menuItem);

  return (
    <Box className="app-container">
      <Box className="page-container">
        <Box className="main-content with-footer scrollable">
          <Header title={menuItem.name_jp || "Dish Details"} />

          {/* Main Image */}
          <Box sx={styles.container}>
            <Box sx={styles.imageContainer}>
              {showSkeleton ? (
                <Skeleton variant="rectangular" sx={styles.mainImage} />
              ) : (
                <Box
                  component="img"
                  src={imageUrl}
                  alt={menuItem.name || "Dish image"}
                  sx={styles.mainImage}
                />
              )}
            </Box>
          </Box>

          {/* Title and Description */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionTitle}>
              {showSkeleton ? (
                <Skeleton variant="text" sx={styles.title} />
              ) : (
                <Typography sx={styles.title}>{menuItem.name}</Typography>
              )}
            </Box>
            <Box sx={styles.sectionContent}>
              {showSkeleton ? (
                <Skeleton variant="text" sx={styles.body} />
              ) : (
                <Typography sx={styles.body}>
                  {menuItem.food_culture || "説明が利用できません"}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Ingredients */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionTitle}>
              <Typography sx={styles.subtitle}>Ingredients</Typography>
            </Box>
            <Box sx={styles.sectionContent}>
              {showSkeleton ? (
                <Skeleton variant="text" sx={styles.body} />
              ) : (
                <Typography sx={styles.body}>
                  {menuItem.ingredients.join(", ") ||
                    "材料情報が利用できません"}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Allergens */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionTitle}>
              <Typography sx={styles.subtitle}>Allergens</Typography>
            </Box>
            <Box sx={styles.sectionContent}>
              <Typography sx={styles.body}>
                {menuItem.allergy_ids && menuItem.allergy_ids.length > 0
                  ? getAllergenNames(menuItem.allergy_ids).join(", ")
                  : "アレルゲン情報なし"}
              </Typography>
            </Box>
          </Box>

          {/* Dietary Restrictions */}
          <Box sx={styles.section}>
            <Box sx={styles.sectionTitle}>
              <Typography sx={styles.subtitle}>Dietary Restrictions</Typography>
            </Box>
            <Box sx={styles.sectionContent}>
              <Box sx={styles.dietaryItemsContainer}>
                {getDietaryRestrictionItems(
                  menuItem.dietary_restriction_ids
                ).map((item, index) => (
                  <DietaryItem
                    key={`${item.label}-${index}`}
                    label={item.label}
                    isSelected={item.isSelected}
                  />
                ))}
              </Box>
            </Box>
          </Box>

          {/* Category Image */}
          {categoryImage && (
            <Box sx={styles.container}>
              <Box sx={styles.imageContainer}>
                <Box
                  component="img"
                  src={categoryImage}
                  alt="Category detail"
                  sx={styles.categoryImage}
                />
              </Box>
            </Box>
          )}
        </Box>

        <Footer />
      </Box>
    </Box>
  );
}

export default MenuDetail;
