import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import client from "../api/client";
import ActivityListing from "./ActivityListing";
import AppLoader from "./AppLoader";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";

const Activities = ({ navigation }) => {
  const [loading, setLoading] = useState(0);
  const [activities, setActivities] = useState([]);

  const getActivities = async () => {
    setLoading(true);
    const res = await client.get("/activities");

    if (res.data.success) {
      setActivities(res.data.activities);
    }
    setLoading(false);
  };
  useEffect(() => {
    getActivities();
  }, []);

  useEffect(()=> {
    const unsubscribe = navigation.addListener('focus', () => {
      getActivities();
    });
  
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: "100%",
          flex: 1,
        }}
      >
        {loading ? (
          <AppLoader />
        ) : (
          <ScrollView style={{ width: "100%"}}>
            {activities.map((activity) => (
              <ActivityListing {...activity} key={activity._id} />
            ))}
          </ScrollView>
        )}
        <TouchableOpacity
          style={{
            backgroundColor: "white",
            paddingVertical: 10,
            borderWidth: 1,
            margin: 20,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => navigation.navigate("CreateActivity")}
        >
          <Text style={{ fontSize: 15, textTransform: "uppercase", fontFamily: "PlusJakartaSans", }}>
            Create Activity
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    fontFamily: "PlusJakartaSans", 
  },
});
