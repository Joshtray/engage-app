import { StyleSheet, Text } from "react-native";
import ImageUpload from "./app/components/ImageUpload";
import DrawerNavigator from "./app/components/DrawerNavigator";
import AppForm from "./app/components/AppForm";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginProvider, { useLogin } from "./app/context/LoginProvider";
import { useFonts } from "expo-font";
import AppLoader from "./app/components/AppLoader";
import CreateActivity from "./app/components/CreateActivity";
import { setCustomText } from "react-native-global-props";
import VerifyEmail from "./app/components/VerifyEmail";
import CompanyNotFound from "./app/components/CompanyNotFound";
import Profile from "./app/components/Profile";
import Activity from "./app/components/Activity";
import MyActivity from "./app/components/MyActivity";
import EditActivity from "./app/components/EditActivity";
import ScheduleMatch from "./app/components/ScheduleMatch";
import SelectInterests from "./app/components/SelectInterests";
import JobDetails from "./app/components/JobDetails";

const Stack = createStackNavigator();

const StackNavigator = ({ navigation }) => {
  const { isLoggedIn, loginPending, isVerified, registered } = useLogin();

  const [loaded] = useFonts({
    PlusJakartaSans: require("./assets/fonts/PlusJakartaSans/PlusJakartaSans-Regular.ttf"),
    PlusJakartaSansMedium: require("./assets/fonts/PlusJakartaSans/PlusJakartaSans-Medium.ttf"),
    PlusJakartaSansBold: require("./assets/fonts/PlusJakartaSans/PlusJakartaSans-Bold.ttf"),
    PlusJakartaSansExtraBold: require("./assets/fonts/PlusJakartaSans/PlusJakartaSans-ExtraBold.ttf"),
    PlusJakartaSansSemiBold: require("./assets/fonts/PlusJakartaSans/PlusJakartaSans-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <>
      {isLoggedIn ? (
        isVerified ? (
          registered === null ? (
            <AppLoader />
          ) : registered ? (
            <>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen
                  name="DrawerNavigator"
                  component={DrawerNavigator}
                />
                <Stack.Screen name="ImageUpload" component={ImageUpload} />
                <Stack.Screen
                  name="CreateActivity"
                  component={CreateActivity}
                />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="Activity" component={Activity} />
                <Stack.Screen name="MyActivity" component={MyActivity} />
                <Stack.Screen name="EditActivity" component={EditActivity} />
                <Stack.Screen name="JobDetails" component={JobDetails} />
                <Stack.Screen
                  name="SelectInterests"
                  component={SelectInterests}
                />
                <Stack.Screen name="ScheduleMatch" component={ScheduleMatch} />
              </Stack.Navigator>
              {loginPending && <AppLoader />}
            </>
          ) : (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="CompanyNotFound"
                component={CompanyNotFound}
              />
            </Stack.Navigator>
          )
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="VerifyEmail" component={VerifyEmail} />
          </Stack.Navigator>
        )
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="AppForm" component={AppForm} />
        </Stack.Navigator>
      )}
    </>
  );
};

export default function App() {
  setCustomText({
    style: {
      fontFamily: "PlusJakartaSans",
    },
  });

  return (
    <LoginProvider>
      <NavigationContainer>
        <StackNavigator />
      </NavigationContainer>
    </LoginProvider>
  );
}

const styles = StyleSheet.create({});
