import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  FontAwesome,
  MaterialCommunityIcons,
  Octicons,
  Ionicons,
} from "react-native-vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import { useLogin } from "../context/LoginProvider";

const ConnectionRequestListing = ({ user, navigation, getRequests }) => {
  const { setProfile, setLoginPending } = useLogin();
  const addConnection = async () => {
    try {
      setLoginPending(true);
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
        getRequests();
      }
    } catch (e) {
      console.log("Error in adding connection: ", e);
    } finally {
      setLoginPending(false);
    }
  };

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
        navigation.navigate("Profile", { user });
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
                user.avatar ||
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
        <Text
          numberOfLines={1}
          style={{
            fontSize: 18,
            fontFamily: "PlusJakartaSansBold",
          }}
        >
          {user.fullname}
        </Text>
        <Text
          numberOfLines={1}
          style={{
            fontSize: 12,
            fontFamily: "PlusJakartaSans",
            color: "#1E1E1E",
          }}
        >
          {user.email}
        </Text>
      </View>
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          columnGap: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
          }}
          onPress={addConnection}
        >
          <Octicons name="person-add" size={25} color="#0B2C7F" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: 35,
            height: 35,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          //   onPress={() => deleteActivityAlert(activity, deleteActivity)}
        >
          <Ionicons name="close" size={25} color="#EA4335" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ConnectionRequestListing;

const styles = StyleSheet.create({});
