import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import * as Progress from "react-native-progress";
import { WebView } from "react-native-webview";

const AppLoader = () => {
  return (
    <View style={[StyleSheet.absoluteFill, styles.container]}>
      <WebView
        source={{
          html: `<script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/bouncy.js"></script>
          <div style="width:100%;
          height:100%;
          background-color:transparent;
          display:flex;
          justify-content:center;
          align-items:center">
          <l-bouncy
            size="200"
            speed="1.3"
            color="#0B2C7F"
          ></l-bouncy>
          </div>`,
        }}
        style={{
          width: Dimensions.get("window").width,
          height: Dimensions.get("window").height,
          backgroundColor: "transparent",
        }}
      />
    </View>
  );
};

export default AppLoader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
    zIndex: 2,
  },
});
