import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Dimensions, Image } from "react-native";
import client from "../api/client";
import AppLoader from "./AppLoader";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  Octicons,
  FontAwesome5,
  MaterialIcons,
} from "react-native-vector-icons";
import { useLogin } from "../context/LoginProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = ({ route, navigation }) => {
  const { user } = route.params;
  const { profile, setProfile } = useLogin();
  const [connectionStatus, setConnectionStatus] = useState("NOT CONNECTED");
  const [connectionButton, setConnectionButton] = useState(null);
  const [loading, setLoading] = useState(false);

  const getConnectionStatus = (profile) => {
    if (profile?.connections.includes(user._id)) {
      setConnectionStatus("CONNECTED");
    } else if (profile?.sentRequests.includes(user._id)) {
      setConnectionStatus("REQUESTED");
    }
  };

  const addConnection = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await client.post(
        `/add-connection`,
        { id: user._id },
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (res.data.success) {
        setProfile(res.data.user);
      }
    } catch (e) {
      console.log("Error in adding connection: ", e);
    } finally {
      setLoading(false);
    }
  };

  const findChatroom = async () => {
    setLoading(true)
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .get("/find-chatroom", {
          params: {
            user2: user._id
          },
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          if (res.data.success) {
            navigation.navigate("ChatRoom", { chatRoom: res.data.chatroom });
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getConnectionStatus(profile);
  }, [profile]);

  useEffect(() => {
    {
      switch (connectionStatus) {
        case "NOT CONNECTED":
          setConnectionButton(
            <TouchableOpacity
              onPress={addConnection}
              style={styles.connectionButton}
            >
              <Text
                style={{
                  padding: 10,
                  fontSize: 20,
                  color: "#0B2C7F",
                }}
              >
                Connect
              </Text>
              <View style={styles.connectionButtonIcon}>
                <Octicons name="person-add" size={24} color="#0B2C7F" />
              </View>
            </TouchableOpacity>
          );
          break;
        case "REQUESTED":
          setConnectionButton(
            <View style={styles.connectionButton}>
              <Text
                style={{
                  padding: 10,
                  fontSize: 20,
                  color: "#A2B7D3",
                }}
              >
                Connection request sent
              </Text>
              <View style={styles.connectionButtonIcon}>
                <FontAwesome5 name="check" size={24} color="#A2B7D3" />
              </View>
            </View>
          );
          break;
        case "CONNECTED":
          setConnectionButton(
            <TouchableOpacity
              style={styles.connectionButton}
              onPress={findChatroom}
            >
              <Text
                style={{
                  padding: 10,
                  fontSize: 20,
                  color: "#0B2C7F",
                }}
              >
                Message
              </Text>
              <View style={styles.connectionButtonIcon}>
                <MaterialIcons name="message" size={24} color="#0B2C7F" />
              </View>
            </TouchableOpacity>
          );
          break;
        default:
          break;
      }
    }
  }, [connectionStatus]);

  return (
    <>
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
        </View>

        <View>
          <View style={styles.userImageContainer}>
            <Image
              source={
                user.avatar
                  ? { uri: user.avatar }
                  : require("../../assets/profile.png")
              }
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 248 / 2,
              }}
            />
          </View>
        </View>
        <Text
          style={{
            fontFamily: "PlusJakartaSansBold",
            fontSize: 25,
            textAlign: "center",
            width: "100%",
            paddingTop: 20,
            paddingBottom: 10,
            color: "#0B2C7F",
          }}
        >
          {user.fullname}
        </Text>
        <Text
          style={{
            fontFamily: "PlusJakartaSans",
            fontSize: 16,
            textAlign: "center",
            width: "100%",
            paddingBottom: 20,
          }}
        >
          {user.email}
        </Text>
        {connectionButton}
      </View>
      {loading && <AppLoader />}
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  userImageContainer: {
    borderRadius: 250 / 2,
    height: 250,
    width: 250,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#A2B7D3",
    borderWidth: 2,
    overflow: "hidden",
    padding: 1,
  },
  connectionButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A2B7D3",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 30,
  },
  connectionButtonIcon: {
    paddingRight: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
