import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLogin } from "../context/LoginProvider";
import { TouchableOpacity } from "react-native-gesture-handler";
import { format } from "date-fns";

const ChatListItem = ({ chatRoom, navigation }) => {
  const { profile } = useLogin();
  const otherUser =
    profile._id === chatRoom.user1._id ? chatRoom.user2 : chatRoom.user1;
  const lastMessage = chatRoom?.messages.length
    ? chatRoom.messages[chatRoom.messages.length - 1]
    : null;
  const time = lastMessage?.sentAt;

  return (
    <TouchableOpacity
      style={{
        display: "flex",
        flexDirection: "row",
        columnGap: 16,
        alignItems: "center",
        padding: 20,
      }}
      onPress={() => {
        navigation.navigate("ChatRoom", { chatRoom });
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: 70,
            height: 70,
          }}
        >
          <Image
            resizeMode="cover"
            source={{
              uri:
                otherUser.avatar ||
                "https://img.freepik.com/free-photo/people-having-fun-wedding-hall_1303-19593.jpg?w=1800&t=st=1702013128~exp=1702013728~hmac=3de0e03364fbdec43b157e208a9765e85ea06fe930ac4b33b459ed05c9388871",
            }}
            style={{
              maxWidth: "100%",
              height: "100%",
              borderRadius: 24,
            }}
          />
        </View>
      </View>
      <View
        style={{
          //   display: "flex",
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            numberOfLines={1}
            style={{
              fontSize: 18,
              fontFamily: "PlusJakartaSansBold",
            }}
          >
            {otherUser.fullname}
          </Text>
          {time && (
            <Text
              style={{
                fontFamily: "PlusJakartaSans",
                fontSize: 12,
              }}
            >
              {format(new Date(time), "HH:mm")}
            </Text>
          )}
        </View>
        {lastMessage && (
          <Text
            numberOfLines={1}
            style={{
              fontSize: 12,
              fontFamily: "PlusJakartaSans",
              color: "#1E1E1E",
            }}
          >
            {lastMessage.sender === profile._id ? "You: " : ""}
            {lastMessage.content}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ChatListItem;

const styles = StyleSheet.create({});
