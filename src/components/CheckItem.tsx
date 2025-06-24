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
        padding: "12px 0px",
        width: "358px",
        alignItems: "center",
      }}
    >
      {/* チェックボックス部分 */}
      <Box
        sx={{
          width: "20px",
          height: "20px",
          border: "2px solid #EBEDFA",
          borderRadius: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <Checkbox
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          sx={{
            padding: 0,
            width: "20px",
            height: "20px",
            "& .MuiSvgIcon-root": {
              fontSize: "16px",
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
        }}
      >
        <Typography
          sx={{
            fontFamily: '"Spline Sans", "Roboto", sans-serif',
            fontWeight: 400,
            fontSize: "16px",
            lineHeight: "1.5em",
            textAlign: "left",
            color: "#121217",
            width: "100%",
          }}
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default CheckItem;
