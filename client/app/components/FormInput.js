import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";

const FormInput = (props) => {
  const [inputColor, setInputColor] = useState("#95989D"); // ["#95989D", "#0B2C7F"
  const { label, placeholder } = props;
  return (
    <View
      style={{
        // borderColor: "#95989D",
        // borderWidth: 1,
        marginBottom: 0,
      }}
    >
      <Text
        style={{
          fontFamily: "PlusJakartaSansBold",
          fontSize: 16,
          color: inputColor,
          marginBottom: 10,
          // transition: "all 0.3s ease-in-out",
        }}
      >
        {label}
      </Text>
      <TextInput
        {...props}
        placeholder={placeholder}
        style={{...styles.input, borderColor: inputColor}}
        onFocus={() => setInputColor("#0B2C7F")}
        onBlur={() => setInputColor("#95989D")}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    height: 50,
    borderRadius: 15,
    fontSize: 16,
    paddingLeft: 10,
    marginBottom: 20,
    fontFamily: "PlusJakartaSans",
  },
});
