import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AppLoader from "./AppLoader";
import ChatListItem from "./ChatListItem";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import { ScrollView } from "react-native-gesture-handler";

const ChatList = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);

  const getChatRooms = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("token");
    await client
      .get("/chatrooms", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          setChats(res.data.chatrooms);
        }
      })
      .catch((e) => {
        console.log(e.response.data)
        console.log("Error in getting chat rooms: ", e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getChatRooms();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getChatRooms();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <Text
          style={{
            fontFamily: "PlusJakartaSansMedium",
            color: "#3C3C43",
            opacity: 0.6,
            fontSize: 16,
          }}
        >
          Loading....
        </Text>
      ) : chats?.length ? (
        <ScrollView
          style={{
            width: "100%",
            height: "100%",
          }}
          contentContainerStyle={{
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          {chats.map((chatRoom) => (
            <ChatListItem
              key={chatRoom._id}
              chatRoom={chatRoom}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      ) : (
        <Text
          style={{
            fontFamily: "PlusJakartaSansMedium",
            color: "#3C3C43",
            opacity: 0.6,
            fontSize: 16,
          }}
        >
          Connect with your co-workers to start chatting!
        </Text>
      )}
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
