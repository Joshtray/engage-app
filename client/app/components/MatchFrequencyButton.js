import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const MatchFrequencyButton = ({ frequency, selected, setFrequency }) => {
  const handleSelect = () => {
    if (selected) {
      setFrequency("")
    } else {
      setFrequency(frequency);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: Dimensions.get("window").width / 3 - 50,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: selected ? "#0B2C7F" : "#EFEFF1",
        borderColor: "#0B2C7F10",
        borderWidth: 1,
      }}
    >
      <Text
        style={{
          color: selected ? "white" : "#0B2C7F",
          fontSize: 18,
          fontFamily: "PlusJakartaSansMedium",
        }}
      >
        {frequency}
      </Text>
    </TouchableOpacity>
  );
};

export default MatchFrequencyButton;

const styles = StyleSheet.create({});
