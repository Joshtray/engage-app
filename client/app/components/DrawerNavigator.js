import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useLogin } from "../context/LoginProvider";
import { useState } from "react";
import AppLoader from "./AppLoader";
import Activities from "./Activities";
import TabNavigator from "./TabNavigator";
import Entypo from "react-native-vector-icons/Entypo";
import MyActivities from "./MyActivities";
import MyActivity from "./MyActivity";
import EditActivity from "./EditActivity";

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const {
    setIsLoggedIn,
    setIsVerified,
    profile,
    loginPending,
    setLoginPending,
    logOut,
  } = useLogin();
  const updateImage = () => {
    props.navigation.navigate("ImageUpload");
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#f6f6f6", zIndex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View
          style={{
            flexDirection: "row",
            // justifyContent: "left",
            columnGap: 20,
            padding: 20,
            alignItems: "center",
            backgroundColor: "#f6f6f6",
            marginBottom: 20,
            width: "100%",
          }}
        >
          <TouchableOpacity
            onPress={updateImage}
            style={{
              borderColor: "#A2B7D3",
              borderWidth: 1,
              borderRadius: 125 / 2,
            }}
          >
            <View style={{ width: 60, height: 60, borderRadius: 30 }}>
              {profile.avatar && (
                <Image
                  source={{
                    uri: profile.avatar,
                  }}
                  style={{ width: 60, height: 60, borderRadius: 30 }}
                />
              )}
            </View>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              rowGap: 3,
              maxWidth: "70%",
            }}
          >
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "PlusJakartaSansBold",
                fontSize: 18,
              }}
            >
              {profile.fullname}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                fontFamily: "PlusJakartaSansMedium",
                fontSize: 12,
              }}
            >
              {profile.email}
            </Text>
          </View>
        </View>

        <DrawerItemList {...props} />
        {/* <DrawerItem label="Help" onPress={() => alert("Link to help")} /> */}
      </DrawerContentScrollView>
      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 20,
          right: 0,
          left: 0,
          backgroundColor: "#f6f6f6",
          padding: 20,
        }}
        onPress={logOut}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "PlusJakartaSansBold",
            fontSize: 16,
            color: "#EA4335",
          }}
        >
          Log Out
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <Pressable
            onPress={navigation.toggleDrawer}
            style={{
              marginLeft: 20,
            }}
          >
            <Entypo name="menu" size={40} color="#0B2C7F" />
          </Pressable>
        ),
        headerShown: true,
        headerShadowVisible: false,
        headerLeftContainerStyle: {
          display: "flex",
          justifyContent: "flex-end",
        },
        headerTitle: "engage",
        headerTitleStyle: {
          fontFamily: "PlusJakartaSansExtraBold",
          fontSize: 30,
          color: "#0B2C7F",
          textAlign: "center",
        },
        drawerType: "front",
      })}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="My Activities"
        component={MyActivities}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
