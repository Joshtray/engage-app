import { StatusBar } from "expo-status-bar";
import {
  Button,
  Image,
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
import { signOut } from "../api/user";
import AppLoader from "./AppLoader";
import Activities from "./Activities";

function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Button title="Open Drawer" style={{fontFamily: "PlusJakartaSans"}} onPress={() => navigation.openDrawer()} />
    </View>
  );
}

const Drawer = createDrawerNavigator();

const CustomDrawer = (props) => {
  const { setIsLoggedIn, profile, loginPending, setLoginPending } = useLogin();
  const updateImage = () => {
    props.navigation.navigate("ImageUpload");
  };
  return (
    <>
      <View style={{ flex: 1, backgroundColor: "#f6f6f6" }}>
        <DrawerContentScrollView {...props}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: 20,
              alignItems: "center",
              backgroundColor: "#f6f6f6",
              marginBottom: 20,
            }}
          >
            <View>
              <Text>{profile.fullname}</Text>
              <Text>{profile.email}</Text>
            </View>
            <TouchableOpacity
              onPress={updateImage}
              style={{
                borderStyle: "dashed",
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
          </View>

          <DrawerItemList {...props} />
          <DrawerItem label="Help" onPress={() => alert("Link to help")} />
        </DrawerContentScrollView>
        <TouchableOpacity
          style={{
            position: "absolute",
            bottom: 50,
            right: 0,
            left: 0,
            backgroundColor: "#f6f6f6",
            padding: 20,
          }}
          onPress={async () => {
            setLoginPending(true);
            const isLoggedOut = await signOut();

            if (isLoggedOut) {
              setIsLoggedIn(false);
            }
            setLoginPending(false);
          }}
        >
          <Text>Log Out</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontFamily: "PlusJakartaSans",
          fontWeight: "bold"
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Activities" component={Activities} />
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
