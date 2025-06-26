import React from "react";
import { Box, Typography, Checkbox } from "@mui/material";

interface CheckItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CheckItem: React.FC<CheckItemProps> = ({ label, checked, onChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "12px",
        padding: {
          xs: "12px 0px", // 320px-424px
          sm: "14px 0px", // 425px以上
        },
        width: "100%", // 固定幅を削除して100%に変更
        maxWidth: "100%", // 親コンテナに収まるように調整
        alignItems: "center",
        boxSizing: "border-box",
        // 段階的調整
        "@media (min-width: 375px) and (max-width: 390px)": {
          padding: "12px 0px",
        },
        "@media (min-width: 391px) and (max-width: 425px)": {
          padding: "13px 0px",
        },
      }}
    >
      {/* チェックボックス部分 */}
      <Box
        sx={{
          width: {
            xs: "20px",
            sm: "22px", // 425px以上では少し大きく
          },
          height: {
            xs: "20px",
            sm: "22px",
          },
          border: "2px solid #EBEDFA",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          flexShrink: 0, // チェックボックスは縮小しない
        }}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          sx={{
            padding: 0,
            width: {
              xs: "20px",
              sm: "22px",
            },
            height: {
              xs: "20px",
              sm: "22px",
            },
            "& .MuiSvgIcon-root": {
              fontSize: {
                xs: "16px",
                sm: "18px",
              },
              color: checked ? "#121217" : "transparent",
            },
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        />
      </Box>

      {/* テキスト部分 */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minWidth: 0, // Flexboxのオーバーフロー対策
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Spline Sans", "Roboto", sans-serif',
            fontWeight: 400,
            fontSize: {
              xs: "16px", // 320px-424px
              sm: "17px", // 425px以上
            },
            // 段階的調整
            "@media (min-width: 375px) and (max-width: 390px)": {
              fontSize: "16px",
            },
            "@media (min-width: 391px) and (max-width: 425px)": {
              fontSize: "16.5px",
            },
            lineHeight: "1.5em",
            textAlign: "left",
            color: "#121217",
            width: "100%",
            wordBreak: "break-word", // 長いテキストの改行対応
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default CheckItem;
