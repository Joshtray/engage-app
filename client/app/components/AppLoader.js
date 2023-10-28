import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import * as Progress from "react-native-progress";

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <Progress.Circle size={100} indeterminate />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 1,
  },
});
