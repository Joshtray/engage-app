import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const FormSubmitButton = ({
  title,
  onPress,
  disabled,
  style,
  twoButton,
  title2,
  onPress2,
  disabled2,
  secondaryOnPress,
  secondaryTitle,
}) => {
  return (
    <View style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 50,
      rowGap: 15,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0
    }}>
      <View
        style={{
          height: 50,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          disabled={disabled}
          onPress={onPress}
          style={{
            ...(disabled
              ? styles.disabledContainer
              : {
                  ...(twoButton ? styles.container1 : styles.container),
                  ...(!twoButton && {
                    shadowColor: "rgba(0, 0, 0, 0.4)",
                    shadowOffset: {
                      width: 0,
                      height: 0,
                    },
                    shadowOpacity: 1,
                    shadowRadius: 10,
                    elevation: 5,
                  }),
                }),
            ...style,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: twoButton ? "#0B2C7F" : "white",
              fontFamily: "PlusJakartaSans",
            }}
          >
            {title}
          </Text>
        </TouchableOpacity>
        {twoButton && (
          <TouchableOpacity
            disabled={disabled2}
            onPress={onPress2}
            style={{
              ...(disabled2 ? styles.disabledContainer : styles.container2),
              ...style,
              marginRight: 10,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                color: "white",
                fontFamily: "PlusJakartaSans",
              }}
            >
              {title2}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {secondaryOnPress && (
        <Text
          style={{
            color: "#0B2C7F",
            textAlign: "center",
            fontFamily: "PlusJakartaSansMedium",
            fontSize: 14,
          }}
          onPress={secondaryOnPress}
        >
          {secondaryTitle}
        </Text>
      )}
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
  container1: {
    height: "100%",
    flex: 1,
    margin: 10,
    backgroundColor: "#FFF",
    borderColor: "#0B2C7F",
    borderWidth: 2,
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  container2: {
    height: "100%",
    flex: 1,
    margin: 10,
    backgroundColor: "#EA4335",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
  disabledContainer: {
    height: "100%",
    width: "69%",
    backgroundColor: "#A2B7D3",
    borderRadius: 27,
    justifyContent: "center",
    alignItems: "center",
  },
});
