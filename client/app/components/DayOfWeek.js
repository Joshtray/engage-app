import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const DayofWeek = ({ dayOfWeek, selected, setSelectedDayOfWeek }) => {
  const handleSelect = () => {
    if (selected) {
      setSelectedDayOfWeek(null)
    } else {
      setSelectedDayOfWeek(dayOfWeek);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: Dimensions.get("window").width / 7 - 15,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 5,
        marginVertical: 5,
        borderColor: "#0B2C7F10",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: selected ? "#0B2C7F" : "#EFEFF1",
      }}
    >
      <Text
        style={{
          color: selected ? "white" : "#0B2C7F",
          fontSize: 16,
          fontFamily: "PlusJakartaSansMedium",
        }}
      >
        {dayOfWeek.substring(0, 3)}
      </Text>
    </TouchableOpacity>
  );
};

export default DayofWeek;

const styles = StyleSheet.create({});
