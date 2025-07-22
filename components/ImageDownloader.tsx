import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Pressable, Text } from "react-native";

export default function ImageDownloader({
  imageUrl,
  fileName = "image",
}: {
  imageUrl: string;
  fileName?: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const downloadImage = async () => {
    try {
      setDownloading(true);

      // Request media library permissions (for saving to gallery)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          "Permission needed",
          "Please grant permission to save images to your gallery."
        );
        return;
      }

      // Get file extension from URL or default to jpg
      const fileExtension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
      const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

      // Download the image to app's document directory
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status === 200) {
        // Save to device gallery/photos
        const asset = await MediaLibrary.createAssetAsync(downloadResult.uri);
        
        // Optionally create/add to album (this step might ask for additional permission)
        try {
          await MediaLibrary.createAlbumAsync("Downloads", asset, false);
        } catch (albumError) {
          // If album creation fails, the image is still saved to gallery
          console.log("Album creation failed, but image saved:", albumError);
        }

        Alert.alert("Success", "Image saved to your gallery!");
        
        // Clean up the temporary file from document directory
        await FileSystem.deleteAsync(downloadResult.uri);
      } else {
        throw new Error("Download failed");
      }
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Pressable
      onPress={downloadImage}
      disabled={downloading}
      className="flex-1 bg-[#294033] rounded-xl py-4 mx-4"
    >
      <Text className="text-white text-center font-semibold">
        {downloading ? "Downloading..." : "Download"}
      </Text>
    </Pressable>
  );
}