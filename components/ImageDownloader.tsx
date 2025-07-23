import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import React, { useState } from "react";
import { Alert, Platform, Pressable, Text } from "react-native";
import { shareAsync } from "expo-sharing";

export default function ImageDownloader({
  imageUrl,
  fileName = "image",
}: {
  imageUrl: string;
  fileName?: string;
}) {
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    try {
      setDownloading(true);

      // Get file extension from URL or default to jpg
      const fileExtension = imageUrl.split(".").pop()?.split("?")[0] || "jpg";
      const fileUri = `${FileSystem.documentDirectory}${fileName}.${fileExtension}`;

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(imageUrl, fileUri);

      if (downloadResult.status !== 200) {
        throw new Error("Download failed");
      }

      // Platform-specific saving logic
      if (Platform.OS === "android") {
        await saveToAndroid(downloadResult.uri, `${fileName}.${fileExtension}`);
      } else {
        await saveToIOS(downloadResult.uri);
      }

      // Clean up the temporary file
      await FileSystem.deleteAsync(downloadResult.uri);
      
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Error", "Failed to download image. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const saveToAndroid = async (uri: string, filename: string) => {
    try {
      // Try to save to MediaLibrary first (requires permission)
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        try {
          await MediaLibrary.createAlbumAsync("Downloads", asset, false);
        } catch (albumError) {
          console.log("Album creation failed, but image saved:", albumError);
        }
        Alert.alert("Success", "Image saved to your gallery!");
      } else {
        // If permission denied, try Storage Access Framework
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            "image/*"
          );

          await FileSystem.writeAsStringAsync(newUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert("Success", "Image saved to your selected folder!");
        } else {
          // Last resort: share the file
          await shareAsync(uri);
        }
      }
    } catch (error) {
      console.error("Android save error:", error);
      // Fallback to sharing
      await shareAsync(uri);
    }
  };

  const saveToIOS = async (uri: string) => {
    try {
      // Try to save to MediaLibrary first
      const { status } = await MediaLibrary.requestPermissionsAsync();
      
      if (status === "granted") {
        const asset = await MediaLibrary.createAssetAsync(uri);
        Alert.alert("Success", "Image saved to your photos!");
      } else {
        // If permission denied, use share dialog
        await shareAsync(uri, {
          dialogTitle: "Save Image",
          mimeType: "image/*",
        });
      }
    } catch (error) {
      console.error("iOS save error:", error);
      // Fallback to sharing
      await shareAsync(uri, {
        dialogTitle: "Save Image",
        mimeType: "image/*",
      });
    }
  };

  return (
    <Pressable
      onPress={download}
      disabled={downloading}
      className="flex-1 bg-[#294033] rounded-xl py-4 mx-4"
    >
      <Text className="text-white text-center font-semibold">
        {downloading ? "Downloading..." : "Download"}
      </Text>
    </Pressable>
  );
}
