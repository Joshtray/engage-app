import { Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const DayofMonth = ({ dayOfMonth, selected, setSelectedDayOfMonth }) => {
  const handleSelect = () => {
    if (selected) {
      setSelectedDayOfMonth(null)
    } else {
      setSelectedDayOfMonth(dayOfMonth);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: Dimensions.get("window").width / 7 - 20,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 5,
        marginVertical: 5,
        borderColor: "#0B2C7F10",
        borderWidth: 1,
        // marginTop: 0,
        borderRadius: 10,
        backgroundColor: selected ? "#0B2C7F" : "#EFEFF1",
      }}
    >
      <Text
        style={{
          color: selected ? "white" : "#0B2C7F",
          fontSize: 18,
          fontFamily: "PlusJakartaSansMedium",
        }}
      >
        {dayOfMonth}
      </Text>
    </TouchableOpacity>
  );
};

export default DayofMonth;

const styles = StyleSheet.create({});
