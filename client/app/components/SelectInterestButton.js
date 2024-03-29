import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const SelectInterestButton = ({ tag, selected, setSelectedTags }) => {
  const handleSelect = () => {
    if (selected) {
      setSelectedTags((prev) => {
        prev.delete(tag._id);
        return new Set(prev);
      });
    } else {
      setSelectedTags((prev) => {
        prev.add(tag._id);
        return new Set(prev);
      });
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: Dimensions.get("window").width / 2 - 30,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        padding: 20,
        margin: 10,
        borderRadius: 10,
        backgroundColor: selected ? "#0B2C7F" : "#EFEFF1",
        borderColor: "#0B2C7F",
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
        {tag.name}
      </Text>
    </TouchableOpacity>
  );
};

export default SelectInterestButton;

const styles = StyleSheet.create({});
