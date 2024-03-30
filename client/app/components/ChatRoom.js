import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { useLogin } from "../context/LoginProvider";
import { Octicons } from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import AppLoader from "./AppLoader";
import Message from "./Message";
import { format } from "date-fns";

const ChatRoom = ({ route, navigation }) => {
  const { profile, setProfile, setIsLoggedIn } = useLogin();
  const [newMessage, setNewMessage] = useState("");
  const [chatRoom, setChatRoom] = useState(route.params.chatRoom);
  const [loading, setLoading] = useState(false);
  let prevChatDay = "";

  const otherUser =
    profile._id === chatRoom.user1._id ? chatRoom.user2 : chatRoom.user1;

  const getChatRoom = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      await client
        .get(`/chatroom/${chatRoom._id}`, {
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.success) {
            setChatRoom(res.data.chatroom);
          }
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleSend = async () => {
    if (!newMessage) return;

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }
      await client
        .post(
          `/chatroom/${chatRoom._id}/send-message`,
          {
            message: newMessage,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: token,
            },
          }
        )
        .then((res) => {
          if (res.data.success) {
            getChatRoom();
            setNewMessage("");
          }
        })
        .catch(function (error) {
          console.log("Error:", error);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getChatRoom();
  }, []);

  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 50,
      }}
    >
      <View
        style={{
          width: "100%",
          paddingVertical: 10,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            width: "100%",
            paddingHorizontal: 30,
          }}
          onPress={() => navigation.goBack()}
        >
          <Octicons name="chevron-left" size={40} color="#0B2C7F" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "PlusJakartaSansBold",
          }}
        >
          {otherUser.fullname}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <ScrollView>
          {chatRoom.messages.map((message) => {
            let newDay = false;
            if (
              prevChatDay !== format(new Date(message.sentAt), "dd MMM yyyy")
            ) {
              prevChatDay = format(new Date(message.sentAt), "dd MMM yyyy")
              newDay = true;
            }

            return (
              <View key={message._id}>
                {newDay && (
                  <Text
                    style={{
                      textAlign: "center",
                      fontFamily: "PlusJakartaSansMedium",
                      fontSize: 12,
                      color: "#A2B7D3",
                      marginVertical: 10,
                    }}
                  >
                    {prevChatDay}
                  </Text>
                )}
                <Message
                  key={message._id}
                  message={message}
                  userId={profile._id}
                />
              </View>
            );
          })}
        </ScrollView>
        <View
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            padding: 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 70,
            columnGap: 10,
          }}
        >
          <TextInput
            style={{
              flex: 1,
              backgroundColor: "#EFEFEF",
              borderRadius: 10,
              padding: 10,
              fontSize: 16,
              color: "#3C3C43",
              fontFamily: "PlusJakartaSansMedium",
              fontFamily: "PlusJakartaSansMedium",
            }}
            placeholder="Type a message..."
            value={newMessage}
            onChangeText={(value) => setNewMessage(value)}
          />
          <TouchableOpacity
            style={{
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#0B2C7F",
              borderRadius: 25,
            }}
            onPress={handleSend}
          >
            <Octicons name="paper-airplane" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      {loading && <AppLoader />}
    </View>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
