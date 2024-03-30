import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { format } from "date-fns";

const Message = ({ message, userId }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: message.sender === userId ? "flex-end" : "flex-start",
        alignItems: "flex-end",
        marginVertical: 3,
        marginHorizontal: 10,
      }}
    >
      {message.sender !== userId &&
      <Text
        style={{
          margin: 3,
          marginLeft: 0,
          fontSize: 8,
          fontFamily: "PlusJakartaSansMedium",
        }}
      >
        {format(new Date(message.sentAt), "HH:mm")}
      </Text>}
      <View
        style={{
          backgroundColor: message.sender === userId ? "#0B2C7F" : "#A2B7D320",
          padding: 10,
          borderRadius: 10,
          maxWidth: "70%",
        }}
      >
        <Text
          style={{
            color: message.sender === userId ? "#fff" : "#000",
            fontFamily: "PlusJakartaSans",
          }}
        >
          {message.content}
        </Text>
      </View>
      {message.sender === userId &&
      <Text
        style={{
          margin: 3,
          marginRight: 0,
          fontSize: 8,
          fontFamily: "PlusJakartaSansMedium",
        }}
      >
        {format(new Date(message.sentAt), "HH:mm")}
      </Text>}
    </View>
  );
};

export default Message;

const styles = StyleSheet.create({});
