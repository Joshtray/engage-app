import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "react-native-vector-icons";

const SearchBar = ({ handleSearch, query, setQuery }) => {
  const [searching, setSearching] = useState(false);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 15,
        borderWidth: 1,
        borderColor: "#A2B7D3",
        height: 50,
        width: "100%",
        marginBottom: 30,
        backgroundColor: "#FAFAFA",
      }}
    >
      <View>
        {!searching && !query && (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              columnGap: 10,
            }}
          >
            <FontAwesome
              name="search"
              size={20}
              color="#3C3C43"
              opacity={0.6}
            />
            <Text
              style={{
                fontSize: 16,
                color: "#3C3C43",
                opacity: 0.6,
                fontFamily: "PlusJakartaSansMedium",
              }}
            >
              Find a new activity!
            </Text>
          </View>
        )}
      </View>
      <TextInput
        // {...props}
        style={{
          // borderWidth: 1,
          width: "100%",
          height: "100%",
          fontSize: 16,
          fontFamily: "PlusJakartaSansBold",
          position: "absolute",
          backgroundColor: "transparent",
          paddingLeft: 20,
          paddingRight: 50,
        }}
        onChangeText={(text) => setQuery(text)}
        autoCapitalize="none"
        value={query}
        onFocus={() => setSearching(true)}
        onBlur={() => setSearching(false)}
      />

      <View
        style={{
          display: "flex",
          flexDirection: "row",
        }}
      >
        {(searching || query) && (
          <View
            style={{
              flex: 1,
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              style={{
                paddingHorizontal: 15,
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleSearch}
            >
              <FontAwesome name="search" size={25} color="#0B2C7F" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
