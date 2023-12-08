import {
  Animated,
  Button,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createBottomTabNavigator,
  BottomTabBar,
} from "@react-navigation/bottom-tabs";
import { useRef, useState } from "react";
import Activities from "./Activities";
import { Ionicons, Octicons, Feather } from "react-native-vector-icons";
import Home from "./Home";
import Communities from "./Communities";

// function Home({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Home Screen</Text>
//       <Button
//         title="Open Drawer"
//         style={{ fontFamily: "PlusJakartaSans" }}
//         onPress={() => navigation.openDrawer()}
//       />
//     </View>
//   );
// }

function Chat({ navigation }) {
  return (
    <View style={styles.container}>
      <Text>Chat Screen</Text>
      <Button
        title="Open Drawer"
        style={{ fontFamily: "PlusJakartaSans" }}
        onPress={() => navigation.openDrawer()}
      />
    </View>
  );
}

// function Community({ navigation }) {
//   return (
//     <View style={styles.container}>
//       <Text>Community Screen</Text>
//       <Button
//         title="Open Drawer"
//         style={{ fontFamily: "PlusJakartaSans" }}
//         onPress={() => navigation.openDrawer()}
//       />
//     </View>
//   );
// }

const Tab = createBottomTabNavigator();

const CustomTabBar = (props) => <BottomTabBar {...props} />;

const TabNavigator = () => {
  const tabOffsetValue = useRef(new Animated.Value(0)).current;
  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "white",
            border: "solid #A2B7D3 2px",
            borderTopWidth: 2,
            borderTopColor: "#A2B7D3",
            height: 80,
            outlineColor: "green",
            outlineStyle: "solid",
            outlineWidth: 4,
          },
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tab.Screen
          name="Home"
          component={Activities}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{}}>
                <Octicons name="home" size={30} color="#0B2C7F" />
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: (Dimensions.get("window").width / 4),
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Activities"
          component={Home}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{}}>
                <Feather name="activity" size={30} color="#0B2C7F" />
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Chat"
          component={Chat}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{}}>
                <Ionicons name="chatbox-outline" size={30} color="#0B2C7F" />
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: (Dimensions.get("window").width / 4) * 2,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Communities"
          component={Communities}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{}}>
                <Octicons name="people" size={30} color="#0B2C7F" />
              </View>
            ),
          }}
          listeners={({ navigation, route }) => ({
            tabPress: (e) => {
              Animated.spring(tabOffsetValue, {
                toValue: (Dimensions.get("window").width / 4) * 3,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
      </Tab.Navigator>
      <Animated.View
        style={{
          width: Dimensions.get("window").width / 4,
          height: 5,
          backgroundColor: "#0B2C7F",
          position: "absolute",
          bottom: 75,
          transform: [
            {
              translateX: tabOffsetValue,
            },
          ],
        }}
      ></Animated.View>
    </>
  );
};

export default TabNavigator;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
