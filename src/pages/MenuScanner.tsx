import {
  Box,
  CircularProgress,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { uploadImageToStorage } from "../services/imageUpload";
// TODO: 将来のカメラ撮影機能実装時に使用予定
// import { uploadCameraImageToStorage } from "../services/imageUpload"

function MenuScanner() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleCameraScan = async () => {
    console.log("Scan with Camera clicked");
    setIsUploading(true);
    setUploadStatus("カメラにアクセス中...");
    setUploadProgress(0);

    try {
      // カメラアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // 背面カメラを優先
        },
      });

      // カメラストリームが取得できた場合
      if (stream) {
        console.log("Camera access granted");
        setUploadStatus("写真を撮影中...");
        setUploadProgress(30);

        // TODO: 実際のカメラプレビューと撮影機能を実装
        // 現在は仮でcanvasを使って画像をキャプチャする処理を想定

        // 仮の画像キャプチャ処理（後で実装）
        // const canvas = document.createElement('canvas')
        // const video = document.createElement('video')
        // video.srcObject = stream
        // ... canvas処理 ...
        // const blob = await canvasToBlob(canvas)

        // 現在は一旦ストリームを停止
        for (const track of stream.getTracks()) {
          track.stop();
        }

        // 仮の処理として直接遷移（実際の撮影・アップロード処理は後で実装）
        setUploadProgress(100);
        setUploadStatus("処理完了");
        setTimeout(() => {
          setIsUploading(false);
          setUploadStatus("");
          setUploadProgress(0);
          navigate("/menu");
        }, 1000);
      }
    } catch (error) {
      console.error("Camera access denied or not available:", error);
      setIsUploading(false);
      setUploadStatus("");
      setUploadProgress(0);

      if (error instanceof Error) {
        if (error.name === "NotAllowedError") {
          alert(
            "カメラへのアクセスが拒否されました。ブラウザの設定でカメラの使用を許可してください。"
          );
        } else if (error.name === "NotFoundError") {
          alert(
            "カメラが見つかりません。デバイスにカメラが接続されているか確認してください。"
          );
        } else {
          alert(
            "カメラアクセスエラーが発生しました。しばらく後でもう一度お試しください。"
          );
        }
      } else {
        alert(
          "カメラへのアクセスが拒否されました。ブラウザの設定を確認してください。"
        );
      }
    }
  };

  const handleUploadImage = () => {
    console.log("Upload Image clicked");
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name);
    console.log("File size:", (file.size / 1024 / 1024).toFixed(2), "MB");
    console.log("File type:", file.type);

    setIsUploading(true);
    setUploadStatus("画像をアップロード中...");
    setUploadProgress(0);

    try {
      // Firebase Cloud Storageにアップロード（進捗コールバック付き）
      const result = await uploadImageToStorage(
        file,
        "menuImages",
        (progress) => {
          setUploadProgress(progress);
          if (progress < 25) {
            setUploadStatus("アップロード準備中...");
          } else if (progress < 75) {
            setUploadStatus("画像をアップロード中...");
          } else if (progress < 100) {
            setUploadStatus("処理を完了中...");
          } else {
            setUploadStatus("アップロード完了!");
          }
        }
      );

      console.log("アップロード成功:", result);
      console.log(
        "ファイルサイズ:",
        (result.fileSize / 1024 / 1024).toFixed(2),
        "MB"
      );
      console.log("Content Type:", result.contentType);

      // アップロード成功後、Menu Analysisページに遷移
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus("");
        setUploadProgress(0);
        navigate("/menu", {
          state: {
            uploadedImage: result.downloadURL,
            imagePath: result.filePath,
            fileSize: result.fileSize,
            contentType: result.contentType,
          },
        });
      }, 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setIsUploading(false);
      setUploadStatus("");
      setUploadProgress(0);

      // エラーメッセージを表示
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("画像のアップロードに失敗しました。もう一度お試しください。");
      }
    }

    // ファイル入力をクリア
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Box className="app-container">
      <Box className="page-container">
        {/* Content Area */}
        <Box className="main-content with-footer">
          {/* Header Component */}
          <Header title="Menu Scanner" />

          {/* Text Content Frame */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "4px 16px 12px",
            }}
          >
            <Typography
              sx={{
                fontFamily: '"Spline Sans", "Roboto", sans-serif',
                fontWeight: 400,
                fontSize: 16,
                lineHeight: "1.5em",
                textAlign: "center",
                color: "#121217",
                width: "100%",
                maxWidth: "100%",
              }}
            >
              Scan the menu with your camera or upload an image
            </Typography>
          </Box>

          {/* アップロード状態表示 */}
          {isUploading && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: "16px",
                gap: "12px",
                margin: "0 16px",
                backgroundColor: "#f8f9fa",
                borderRadius: "8px",
                border: "1px solid #e1e5e9",
              }}
            >
              <CircularProgress size={40} sx={{ color: "#4263FA" }} />
              <Typography
                sx={{
                  fontFamily: '"Spline Sans", "Roboto", sans-serif',
                  fontWeight: 500,
                  fontSize: 14,
                  color: "#121217",
                  textAlign: "center",
                }}
              >
                {uploadStatus}
              </Typography>

              {/* 進捗バー */}
              <Box sx={{ width: "100%", maxWidth: "200px" }}>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "#4263FA",
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontFamily: '"Spline Sans", "Roboto", sans-serif',
                    fontSize: 12,
                    color: "#666",
                    textAlign: "center",
                    marginTop: "4px",
                  }}
                >
                  {Math.round(uploadProgress)}%
                </Typography>
              </Box>
            </Box>
          )}

          {/* Buttons Container */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "12px 16px",
              alignItems: "center",
            }}
          >
            {/* Primary Button - Scan with Camera */}
            <Button
              variant="primary"
              disabled={isUploading}
              sx={{
                backgroundColor: isUploading ? "#ccc" : "#4263FA",
                color: "#FFFFFF",
                width: "100%",
                maxWidth: "358px",
                height: "48px",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: isUploading ? "#ccc" : "#3651E6",
                },
                "&:active": {
                  backgroundColor: isUploading ? "#ccc" : "#2A41D0",
                },
                "&:disabled": {
                  backgroundColor: "#ccc",
                  color: "#999",
                },
              }}
              onClick={handleCameraScan}
            >
              Scan with Camera
            </Button>

            {/* Secondary Button - Upload Image */}
            <Button
              variant="secondary"
              disabled={isUploading}
              sx={{
                backgroundColor: isUploading ? "#f5f5f5" : "#E8EDFA",
                color: isUploading ? "#999" : "#121217",
                width: "100%",
                maxWidth: "358px",
                height: "48px",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: isUploading ? "#f5f5f5" : "#D6E1F7",
                },
                "&:active": {
                  backgroundColor: isUploading ? "#f5f5f5" : "#C4D5F4",
                },
                "&:disabled": {
                  backgroundColor: "#f5f5f5",
                  color: "#999",
                },
              }}
              onClick={handleUploadImage}
            >
              Upload Image
            </Button>
          </Box>

          {/* Hidden file input for image upload */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
        </Box>

        {/* Footer */}
        <Footer />
      </Box>
    </Box>
  );
}

export default MenuScanner;
