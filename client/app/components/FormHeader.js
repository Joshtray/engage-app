import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";

const FormHeader = ({
  leftHeading,
  rightHeading,
  subHeading,
  leftHeaderTranslateX = 40,
  rightHeaderTranslateY = -20,
  rightHeaderOpacity = 0,
}) => {
  return (
    <>
      <View style={styles.container}>
        <Animated.Text
          style={{
            ...styles.heading,
            transform: [{ translateX: leftHeaderTranslateX }],
          }}
        >
          {leftHeading}
        </Animated.Text>
        <Animated.Text
          style={{
            ...styles.heading,
            opacity: rightHeaderOpacity,
            transform: [{ translateY: rightHeaderTranslateY }],
          }}
        >
          {rightHeading}
        </Animated.Text>
      </View>
      <Text style={styles.subHeading}>{subHeading}</Text>
    </>
  );
};

export default FormHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "PlusJakartaSans",
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1b1b33",
    fontFamily: "PlusJakartaSans",
  },
  subHeading: {
    fontSize: 18,
    color: "#1b1b33",
    textAlign: "center",
    fontFamily: "PlusJakartaSans",
  },
});
