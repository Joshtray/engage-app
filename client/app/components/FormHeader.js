import { StyleSheet, Text, View, Animated } from "react-native";
import React from "react";

const FormHeader = ({
  heading,
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
        {heading ? (
          <Text style={styles.heading}>{heading}</Text>
        ) : (
          <>
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
          </>
        )}
      </View>
      {subHeading && <Text style={styles.subHeading}>{subHeading}</Text>}
    </>
  );
};

export default FormHeader;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "PlusJakartaSans",
  },
  heading: {
    fontSize: 30,
    color: "#0B2C7F",
    textAlign: "center",
    fontFamily: "PlusJakartaSansExtraBold",
  },
  subHeading: {
    fontSize: 18,
    color: "#1b1b33",
    textAlign: "center",
    fontFamily: "PlusJakartaSans",
  },
});
