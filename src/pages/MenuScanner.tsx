import { Box, CircularProgress, LinearProgress, Typography } from "@mui/material"
import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../components/Button"
import Footer from "../components/Footer"
import Header from "../components/Header"
import { uploadImageToStorage } from "../services/imageUpload"
import { processMenuImage } from "../services/menuProcessingService"
import { saveMenuCollectionId } from "../utils/localStorage"

function MenuScanner() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<string>("")
  const [uploadProgress, setUploadProgress] = useState<number>(0)

  const handleUploadImage = () => {
    console.log("Upload Image clicked")
    if (!isUploading && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    console.log("File selected:", file.name)
    console.log("File size:", (file.size / 1024 / 1024).toFixed(2), "MB")
    console.log("File type:", file.type)

    setIsUploading(true)
    setUploadStatus("Uploading image...")
    setUploadProgress(0)

    try {
      // Upload to Firebase Cloud Storage with progress callback
      const result = await uploadImageToStorage(file, "menuImages", (progress: number) => {
        setUploadProgress(progress)
        if (progress < 25) {
          setUploadStatus("Preparing upload...")
        } else if (progress < 75) {
          setUploadStatus("Uploading image...")
        } else if (progress < 100) {
          setUploadStatus("Completing process...")
        } else {
          setUploadStatus("Upload complete!")
        }
      })

      console.log("Upload successful:", result)
      console.log("File size:", (result.fileSize / 1024 / 1024).toFixed(2), "MB")
      console.log("Content Type:", result.contentType)

      // Call menu image processing API
      setUploadStatus("Analyzing menu...")
      setUploadProgress(100)

      try {
        const processResult = await processMenuImage(result.filePath)
        console.log("Menu processing result:", processResult)

        // Save documentId to localStorage
        if (processResult.success && processResult.documentId) {
          saveMenuCollectionId(processResult.documentId)
          console.log("menuCollectionId saved:", processResult.documentId)
        }

        // Navigate to Menu Analysis page
        navigate("/menu", {
          state: {
            uploadedImage: result.downloadURL,
            imagePath: result.filePath,
            fileSize: result.fileSize,
            contentType: result.contentType,
            menuCollectionId: processResult.documentId,
            menuCount: processResult.menuCount,
          },
        })
      } catch (apiError) {
        console.error("Menu processing API error:", apiError)
        // Continue page navigation even in case of API error (fallback)
        setIsUploading(false)
        setUploadStatus("")
        setUploadProgress(0)
        navigate("/menu", {
          state: {
            uploadedImage: result.downloadURL,
            imagePath: result.filePath,
            fileSize: result.fileSize,
            contentType: result.contentType,
          },
        })

        // Display error message
        alert("Menu analysis failed. Please check the menu manually.")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setIsUploading(false)
      setUploadStatus("")
      setUploadProgress(0)

      // Display error message
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert("Image upload failed. Please try again.")
      }
    }

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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
  )
}

export default MenuScanner
