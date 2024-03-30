import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const ChatTab = ({ tab, selected, setTab }) => {
  const handleSelect = () => {
    setTab(tab);
  };

  return (
    <TouchableOpacity
      onPress={handleSelect}
      style={{
        width: Dimensions.get("window").width / 2 - 50,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginHorizontal: 10,
        borderRadius: 10,
        backgroundColor: selected ? "#0B2C7F" : "#FFFFFF",
      }}
    >
      <Text
        style={{
          color: selected ? "white" : "#0B2C7F",
          fontSize: 14,
          fontFamily: "PlusJakartaSansSemiBold",
        }}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );
};

export default ChatTab;

const styles = StyleSheet.create({});
