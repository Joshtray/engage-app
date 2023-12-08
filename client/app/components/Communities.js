import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import client from "../api/client";
import { ScrollView } from "react-native-gesture-handler";
import { useLogin } from "../context/LoginProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CommunityListing from "./CommunityListing";

const Communities = ({ navigation }) => {
  const { loginPending, setLoginPending } = useLogin();
  const [communities, setCommunities] = useState([]);
  const [myCommunities, setMyCommunities] = useState({});

  const getCommunities = async () => {
    setLoginPending(true);
    const token = await AsyncStorage.getItem("token");
    const response = await client.get("/my-communities", {
      headers: {
        Authorization: token,
      },
    });
    let myCommunityMap = {};
    if (response.data.success) {
      response.data.communities.forEach((community) => {
        myCommunityMap[community._id] = community;
      });
      setMyCommunities(myCommunityMap);
    }

    const res = await client.get("/communities");
    let communityMap = [];
    if (res.data.success) {
      res.data.communities.forEach((community) => {
        if (!myCommunityMap[community._id]) {
          communityMap.push(community);
        }
      });
      setCommunities(communityMap);
    }
    setLoginPending(false);
  };

  useEffect(() => {
    getCommunities();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCommunities();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <ScrollView style={styles.container}>
        <View
          style={{
            width: "100%",
            flex: 1,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 20,
                lineHeight: 50,
                fontFamily: "PlusJakartaSansSemiBold",
              }}
            >
              Your communities:
            </Text>
            {loginPending ||
              (myCommunities && Object.keys(myCommunities).length > 0 ? (
                <ScrollView
                  style={{
                    width: "100%",
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {Object.keys(myCommunities).map((id) => (
                    <CommunityListing
                      key={id}
                      community={myCommunities[id]}
                      joined={true}
                      getCommunities={getCommunities}
                    />
                  ))}
                </ScrollView>
              ) : (
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    flex: 1,
                    height: 120,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "PlusJakartaSansMedium",
                      color: "#3C3C43",
                      opacity: 0.6,
                      fontSize: 16,
                    }}
                  >
                    No communities yet
                  </Text>
                </View>
              ))}
          </View>
          <View>
            <Text
              style={{
                fontSize: 20,
                lineHeight: 50,
                fontFamily: "PlusJakartaSansSemiBold",
              }}
            >
              Communities at your company:
            </Text>
            {loginPending || (
              <ScrollView
                style={{ width: "100%" }}
                showsVerticalScrollIndicator={false}
              >
                {communities.map((community) => (
                  <CommunityListing
                    key={community._id}
                    community={community}
                    getCommunities={getCommunities}
                  />
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default Communities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    // alignItems: "center",
    // justifyContent: "flex-start",
    fontFamily: "PlusJakartaSans",
    backgroundColor: "white",
    paddingTop: 50,
    paddingBottom: 100,
  },
});
