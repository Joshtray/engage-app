import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const FormSubmitButton = ({ title, onPress }) => {
  return (
    <View
      style={{
        height: 50,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        marginBottom: 60,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onPress} style={styles.container}>
        <Text
          style={{
            fontSize: 18,
            color: "white",
            fontFamily: "PlusJakartaSans",
          }}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FormSubmitButton;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "69%",
    backgroundColor: "#0B2C7F",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
});
