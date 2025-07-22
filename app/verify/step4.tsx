import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
// import { useCameraPermission } from "react-native-vision-camera";
const Step4 = () => {
  // const { hasPermission, requestPermission } = useCameraPermission();
  // console.log("Camera Permission:", hasPermission);
  return (
    <View>
      <Text>step4</Text>
      <Pressable
        onPress={() => console.log("Next step")}
        className="bg-primary rounded-full py-3 flex-row justify-center items-center"
      >
        <Text className="text-black font-semibold">Next</Text>
      </Pressable>
    </View>
  );
};

export default Step4;

const styles = StyleSheet.create({});
