import {
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import ActivityListing from "./ActivityListing";
import { useLogin } from "../context/LoginProvider";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../api/client";
import { Octicons, FontAwesome } from "react-native-vector-icons";
import SearchBar from "./SearchBar";

const SearchResults = ({ route, navigation }) => {
  const [query, setSearchQuery] = useState(route.params.query);
  const { loginPending, setLoginPending } = useLogin();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQueryLabel, setSearchQueryLabel] = useState(route.params.query);

  const searchActivities = async () => {
    Keyboard.dismiss();
    setLoginPending(true);
    try {
      const token = await AsyncStorage.getItem("token");
      await client
        .get("/search", {
          params: {
            query,
          },
          headers: {
            Authorization: token,
          },
        })
        .then((res) => {
          console.log(res.data);
          if (res.data.success) {
            setSearchQueryLabel(query);
            setSearchResults(res.data.activities);
          }
        })
        .catch((error) => {
          console.log(error.response.data.message);
        });
    } catch (error) {
      console.log(error);
    } finally {
      setLoginPending(false);
    }
  };

  useEffect(() => {
    searchActivities();
  }, []);
  return (
    <View
      style={{
        height: "100%",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
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
      <View
        style={{
          width: "100%",
          flex: 1,
          marginTop: 15,
          paddingHorizontal: 20,
        }}
      >
        <SearchBar
          handleSearch={searchActivities}
          query={query}
          setQuery={setSearchQuery}
        />
        <View
          style={{
            marginBottom: 80,
            minHeight: 150,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              lineHeight: 50,
              fontFamily: "PlusJakartaSansSemiBold",
            }}
          >
            Search results for "{searchQueryLabel}":
          </Text>
          {loginPending || (searchResults && searchResults?.length > 0) ? (
            <ScrollView
              style={{ width: "100%", height: "90%" }}
              showsVerticalScrollIndicator={false}
            >
              {searchResults.map((activity) => (
                <ActivityListing
                  navigation={navigation}
                  getActivities={() => {}}
                  activity={activity}
                  key={activity._id}
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
                No results found
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default SearchResults;

const styles = StyleSheet.create({});
