import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

const FormContainer = ({ children, style }) => {
  return (
    <KeyboardAvoidingView
      enabled
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ ...styles.container, ...style }}
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 27,
    width: Dimensions.get("window").width,
    height: "100%",
    position: "relative",
  },
});
