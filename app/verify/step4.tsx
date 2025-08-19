import { createReceipt, getPresignedUrl } from "@/lib/api/receipts";
import { useReceiptStore } from "@/lib/verify-store";
import {
  CameraCapturedPicture,
  CameraType,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Step4() {
  const { mutateAsync: getPresignedUrlAsync } = getPresignedUrl({ params: {} });
  const { mutateAsync: createReceiptAsync } = createReceipt({
    params: {},
  });
  const { formData, setCurrentStep, setReceiptId } = useReceiptStore();
  const [submitting, setSubmitting] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [image, setImage] = useState<
    CameraCapturedPicture | ImagePicker.ImagePickerAsset | null
  >(null);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView | null>(null);

  const isCamera = formData.imageUploadMethod === "camera";

  if (isCamera && !permission) {
    return <View />;
  }

  if (isCamera && permission && !permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-white text-lg mb-4">
          We need your permission to show the camera
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary2 rounded-full px-6 py-3"
        >
          <Text className="text-white">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  async function captureImage() {
    const cameraReady = ref.current;
    if (cameraReady) {
      const photo = await cameraReady.takePictureAsync();
      setImage(photo);
    }
  }

  async function pickImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [9, 16],
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picker error:", error);
    }
  }

  async function handleSubmit() {
    if (!image) {
      console.error("No image captured");
      return;
    }
    try {
      if (!getPresignedUrlAsync || !createReceiptAsync) return;
      setSubmitting(true);
      const { data, error } = await getPresignedUrlAsync({ params: {} });
      if (error || !data?.data?.url || !data?.data?.key) {
        Alert.alert("Something went wrong", "Could not get upload URL.");
        setSubmitting(false);
        return;
      }
      const { url, key } = data.data;
      const blobResponse = await fetch(image.uri);
      const blob = await blobResponse.blob();
      const contentType =
        "format" in image ? image.format : image.mimeType || "image/jpeg";
      const res = await fetch(url, {
        method: "PUT",
        body: blob,
        headers: { "Content-Type": contentType },
      });
      if (!res.ok) {
        Alert.alert("Upload failed", "Please try again later.");
        setSubmitting(false);
        return;
      }
      const receiptData = {
        imageKey: key,
        vendor: formData.vendor,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        category: formData.category,
        transactionFee: parseFloat(formData.transactionFee) || 0,
      };
      const { data: createReceiptData, error: createReceiptError } =
        await createReceiptAsync(receiptData);

      if (createReceiptError) {
        Alert.alert("Receipt creation failed", "Please try again later.");
        setSubmitting(false);
        return;
      }

      console.log("Receipt created:", createReceiptData?.receipt?.id);

      const newReceiptId = createReceiptData?.receipt?.id;

      if (!newReceiptId) {
        Alert.alert(
          "Receipt creation failed",
          "Could not get new receipt ID from the server."
        );
        setSubmitting(false);
        return;
      }

      setReceiptId(newReceiptId);
      setImage(null);
      setCurrentStep(5);
      router.push("/verify/step5");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.log("Error during submit process:", error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View className="flex-1 bg-background px-6">
      {image ? (
        <>
          <View className="h-[80%] w-auto aspect-[9/16] mx-auto">
            <View className="flex-1 items-center justify-center">
              <Image
                source={{ uri: image.uri }}
                className="w-full aspect-[9/16] mx-auto"
              />
            </View>
          </View>
          <View className="mt-auto mb-6">
            <Pressable
              disabled={submitting}
              onPress={() => setImage(null)}
              className={`${
                submitting ? "bg-primaryMuted" : "bg-primary2"
              } rounded-full py-3 flex-row justify-center items-center`}
            >
              <Text className="text-white">
                {isCamera ? "Take new Image" : "Choose new Image"}
              </Text>
            </Pressable>
            <Pressable
              disabled={submitting}
              onPress={handleSubmit}
              className={`${
                submitting ? "bg-primaryMuted" : "bg-primary2"
              } rounded-full py-3 flex-row mt-4 justify-center items-center`}
            >
              <Text className="text-white">
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : isCamera ? (
        <>
          <View className="h-[80%] w-auto aspect-[9/16] mx-auto">
            <View className="flex-1 items-center justify-center">
              <CameraView ref={ref} style={styles.camera} facing={facing} />
            </View>
          </View>
          <View className="mt-auto mb-6">
            <Pressable
              onPress={captureImage}
              className="bg-primary2 rounded-full py-3 flex-row justify-center items-center"
            >
              <Text className="text-white">Capture</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <View className="h-[80%] w-auto aspect-[9/16] mx-auto">
          <View className="flex-1 bg-black rounded-lg items-center justify-center">
            <Text className="text-white text-lg mb-4">No image selected</Text>
          </View>
          <View className="mt-auto mb-6">
            <Pressable
              onPress={pickImage}
              className="bg-primary2 rounded-full py-3 flex-row justify-center items-center"
            >
              <Text className="text-white">Choose Image</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    aspectRatio: 9 / 16,
    width: "100%",
    height: "100%",
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
