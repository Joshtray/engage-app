import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import client from "../api/client";
import AppLoader from "./AppLoader";
import { format } from "date-fns";

const ActivityListing = (props) => {
  const [ownerAvatar, setOwnerAvatar] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const getOwner = async () => {
    const res = await client.get(`/users/${props.owner}`);
    if (res.data.success) {
      setOwnerAvatar(res.data.user.avatar);
      setOwnerName(res.data.user.fullname);
    }
  };
  useEffect(() => {
    getOwner();
  }, []);
  return (
    <>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 20,
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
          {!ownerAvatar ? (
            <AppLoader />
          ) : (
            <>
              <Image
                source={{ uri: ownerAvatar }}
                style={{ width: 40, height: 40, borderRadius: 25 }}
              />
              <Text style={{ fontSize: 12, textAlign: "center", fontFamily: "PlusJakartaSans"}}>
                {ownerName}
              </Text>
            </>
          )}
        </View>
        <View>
          <Text style={{ fontWeight: "bold", fontSize: 18, fontFamily: "PlusJakartaSans", }}>{props.name}</Text>
          <Text style={{ fontSize: 12, fontFamily: "PlusJakartaSans", }}>{props.description}</Text>
        </View>
        <View style={{}}>
          <Text style={{ fontSize: 10, textAlign: "right", fontFamily: "PlusJakartaSans" }}>
            {format(new Date(props.date), "yyyy/MM/dd HH:mm")}
          </Text>
          <Text style={{ fontSize: 10, textAlign: "right", fontFamily: "PlusJakartaSans",  }}>
            {props.location}
          </Text>
        </View>
      </View>
    </>
  );
};

export default ActivityListing;

const styles = StyleSheet.create({});
