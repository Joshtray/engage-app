import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import ChatTab from "./ChatTab";
import ConnectionRequests from "./ConnectionRequests";
import AppLoader from "./AppLoader";
import ChatList from "./ChatList";

const Chat = ({ navigation }) => {
  const [tab, setTab] = useState("Chats");

  return (
    <View style={styles.container}>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          marginBottom: 20,
        }}
      >
        <ChatTab tab="Chats" selected={tab === "Chats"} setTab={setTab} />
        <ChatTab tab="Requests" selected={tab === "Requests"} setTab={setTab} />
      </View>
      <View>
        {tab === "Chats" ? (
          <ChatList navigation={navigation} />
        ) : (
          <ConnectionRequests navigation={navigation} />
        )}
      </View>
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    fontFamily: "PlusJakartaSans",
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 60,
  },
});
