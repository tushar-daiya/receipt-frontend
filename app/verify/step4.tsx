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
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Step4() {
  const { mutateAsync } = getPresignedUrl({ params: {} });
  const { mutateAsync: createReceiptMutateAsync } = createReceipt({
    params: {},
  });
  const { formData, resetForm } = useReceiptStore();
  const [submitting, setSubmitting] = useState(false);
  const [facing, setFacing] = useState<CameraType>("back");
  const [image, setImage] = useState<
    CameraCapturedPicture | ImagePicker.ImagePickerAsset | null
  >(null);
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef<CameraView | null>(null);

  const isCamera = formData.imageUploadMethod === "camera";

  if (isCamera && !permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (isCamera && permission && !permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-white text-lg mb-4">
          We need your permission to show the camera
        </Text>
        <Pressable
          onPress={() => requestPermission()}
          className="bg-primary rounded-full px-6 py-3"
        >
          <Text className="text-black font-semibold">Grant Permission</Text>
        </Pressable>
      </View>
    );
  }

  async function captureImage() {
    const cameraReady = ref.current;
    if (cameraReady) {
      const photo = await cameraReady.takePictureAsync();
      console.log(photo);
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
        console.log(result.assets[0]);
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
      if (!mutateAsync || !createReceiptMutateAsync) return;
      setSubmitting(true);
      const { data, error } = await mutateAsync({ params: {} });
      if (error) {
        Alert.alert("Something went wrong", "Please try again later.");
        setSubmitting(false);
        return;
      }
      const url = data?.data?.url;
      const key = data?.data?.key;
      if (!url || !key) {
        Alert.alert("Something went wrong", "Please try again later.");
        setSubmitting(false);
        return;
      }
      const blobResponse = await fetch(image.uri);
      const blob = await blobResponse.blob();

      // Determine content type based on image source
      const contentType =
        "format" in image ? image.format : image.mimeType || "image/jpeg";

      const res = await fetch(url, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": contentType,
        },
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
        transactionFee: parseFloat(formData.transactionFee) || 0, // Ensure transactionFee is a number
      };
      const {
        status,
        data: createReceiptData,
        error: createReceiptError,
      } = await createReceiptMutateAsync(receiptData);
      if (createReceiptError) {
        Alert.alert("Receipt creation failed", "Please try again later.");
        setSubmitting(false);
        return;
      }
      setImage(null);
      resetForm();
      router.replace("/");
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.log("Error getting presigned URL:", error);
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
              className={`${submitting ? "bg-primaryMuted" : "bg-primary"} rounded-full py-3 flex-row justify-center items-center`}
            >
              <Text className="text-black font-semibold">
                {isCamera ? "Take new Image" : "Choose new Image"}
              </Text>
            </Pressable>
            <Pressable
              disabled={submitting}
              onPress={handleSubmit}
              className={`${submitting ? "bg-primaryMuted" : "bg-primary"} rounded-full py-3 flex-row mt-4 justify-center items-center`}
            >
              <Text className="text-black font-semibold">
                {submitting ? "Submitting..." : "Submit"}
              </Text>
            </Pressable>
          </View>
        </>
      ) : isCamera ? (
        <View className="h-[80%] w-auto aspect-[9/16] mx-auto">
          <CameraView ref={ref} style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={captureImage}>
                <Text style={styles.text}>Capture</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      ) : (
        <View className="h-[80%] w-auto aspect-[9/16] mx-auto">
          <View className="flex-1 bg-black rounded-lg items-center justify-center">
            <Text className="text-white text-lg mb-4">No image selected</Text>
          </View>
          <View className="mt-auto mb-6">
            <Pressable
              onPress={pickImage}
              className="bg-primary rounded-full py-3 flex-row justify-center items-center"
            >
              <Text className="text-black font-semibold">Choose Image</Text>
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
    // height: "70%",
    // width: "50%",
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
