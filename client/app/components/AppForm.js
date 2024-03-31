import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import FormSelectorButton from "./FormSelectorButton";
import FormHeader from "./FormHeader";
import axios from "axios";
import AppLoader from "./AppLoader";
import { useLogin } from "../context/LoginProvider";
import client from "../api/client";

const AppForm = ({ navigation }) => {
  const width = Dimensions.get("window").width;
  const animation = useRef(new Animated.Value(0)).current;
  const scrollView = useRef();

  const { loginPending } = useLogin();

  const leftHeaderTranslateX = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, 40],
    extrapolate: "clamp",
  });

  const rightHeaderOpacity = animation.interpolate({
    inputRange: [0, width],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const rightHeaderTranslateY = animation.interpolate({
    inputRange: [0, width],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const signUpColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(27, 27, 51, 0.4)", "rgba(27, 27, 51, 1)"],
    extrapolate: "clamp",
  });

  const loginColorInterpolate = animation.interpolate({
    inputRange: [0, width],
    outputRange: ["rgba(27, 27, 51, 1)", "rgba(27, 27, 51, 0.4)"],
    extrapolate: "clamp",
  });

  const fetchApi = async () => {
    try {
      const response = await client.get("/");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchApi();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{
        height: "100%",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={{
          flex: 1,
          paddingTop: 50,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#fff",
        }}
      >
        <View style={{ height: 100 }}>
          <FormHeader
            heading={"engage"}
            // leftHeading={"Welcome "}
            // rightHeading={"Back"}
            // subHeading={"engage"}
            // leftHeaderTranslateX={leftHeaderTranslateX}
            // rightHeaderOpacity={rightHeaderOpacity}
            // rightHeaderTranslateY={rightHeaderTranslateY}
          />
        </View>
        {/* <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 20,
              marginBottom: 20,
            }}
          >
            <FormSelectorButton
              style={styles.borderLeft}
              title="Login"
              backgroundColor={loginColorInterpolate}
              onPress={() => scrollView.current.scrollTo({ x: 0 })}
            />
            <FormSelectorButton
              style={styles.borderRight}
              title="Sign Up"
              backgroundColor={signUpColorInterpolate}
              onPress={() => scrollView.current.scrollTo({ x: width })}
            />
          </View> */}
        <ScrollView
          ref={scrollView}
          horizontal
          pagingEnabled
          style={{}}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          // onScroll={Animated.event(
          //   [{ nativeEvent: { contentOffset: { x: animation } } }],
          //   { useNativeDriver: false }
          // )}
        >
          <View>
            <LoginForm navigation={navigation} scrollView={scrollView} />
          </View>
          <View>
            <SignUpForm navigation={navigation} scrollView={scrollView} />
          </View>
        </ScrollView>
      </View>
      {loginPending && <AppLoader />}
    </KeyboardAvoidingView>
  );
};

export default AppForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  borderLeft: {
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  borderRight: {
    borderBottomRightRadius: 8,
    borderTopRightRadius: 8,
  },
});
