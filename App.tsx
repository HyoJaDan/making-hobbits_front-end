import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { Colors } from "./assets/color/color";
import MealDetailScreen from "./components/challenge/myGoal/mealDetailScreen";
import AuthContextProvider from "./data/auth-context";
import { todayPersonalChallenge } from "./data/personalChallenge/personalChallengeData";
import { IsMemberWithTeam, userId } from "./data/user/userData";
import { getIsMemberWithTeam } from "./data/user/userDataHandler";
import WelcomeScreen from "./screens/MyRecord";
import MyGoalScreen from "./screens/challenge/myGoalScreen";
import MyTeamScreen from "./screens/challenge/myTeamScreen";
import ChallengeDetailScreen from "./screens/findChallenge/ChallengeDetail";
import AddChallenge from "./screens/findChallenge/addChallenge";
import { FindChallenge } from "./screens/findChallenge/findChallenge";
import LoginScreen from "./screens/initScreen/LoginScreen";
import SignupScreen from "./screens/initScreen/SignupScreen";
const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: "white",
        contentStyle: { backgroundColor: Colors.primary100 },
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  );
}
function FindChallengeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FindChallenge" component={FindChallenge} />
      <Stack.Screen name="ChallengeDetail" component={ChallengeDetailScreen} />
      <Stack.Screen name="AddChallenge" component={AddChallenge} />
    </Stack.Navigator>
  );
}
const Tab = createMaterialTopTabNavigator();
function ChallengeStack() {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarLabelStyle: {
          color: Colors.basic.text_default,
          fontSize: 18,
          fontFamily: "Pretendard-Bold",
        },
        tabBarIndicatorStyle: { height: 3 },
      }}
    >
      <Tab.Screen name="내 목표" component={MyGoalChallengeStack} />
      <Tab.Screen name="내 팀" component={MyTeamScreen} />
    </Tab.Navigator>
  );
}
function MyGoalChallengeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyGoalScreen" component={MyGoalScreen} />
      <Stack.Screen name="MealDetailScreen" component={MealDetailScreen} />
    </Stack.Navigator>
  );
}
function AuthenticatedStack() {
  //const authCtx = useContext(AuthContext);
  const BottomTab = createBottomTabNavigator();
  const id = useRecoilValue(userId);
  const [isMemberWithTeam, setIsMemberWithTeam] =
    useRecoilState(IsMemberWithTeam);
  const getTeam = useRecoilValue(todayPersonalChallenge);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getIsMemberWithTeam(id as number);
      if (response !== null) setIsMemberWithTeam(response);
    };
    fetchData();
  }, [isMemberWithTeam]);

  return (
    <BottomTab.Navigator>
      <BottomTab.Screen
        name="내 기록"
        component={WelcomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="face" color={color} size={size} />
          ),
          headerShown: false,
        }}
      />
      {isMemberWithTeam === false ? (
        <BottomTab.Screen
          name="챌린지"
          component={FindChallengeStack}
          options={{
            headerShown: false,
            /* headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ), */
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="fire-circle"
                color={color}
                size={size}
              />
            ),
          }}
        />
      ) : (
        <BottomTab.Screen
          name="챌린지"
          component={ChallengeStack}
          options={{
            title: getTeam.team.teamName,
            tabBarLabel: "챌린지",
            headerTitleStyle: {
              color: "#191B23",
              fontFamily: "Pretendard-Bold",
              fontSize: 20,
              fontWeight: "700",
              lineHeight: 26,
            },
            /* headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ), */
            tabBarIcon: ({ focused, color, size }) => (
              <MaterialCommunityIcons
                name="fire-circle"
                color={color}
                size={size}
              />
            ),
          }}
        />
      )}
    </BottomTab.Navigator>
  );
}

function Navigation() {
  /* const authCtx = useContext(AuthContext); */
  return (
    <NavigationContainer>
      {/* {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />} */}
      <AuthenticatedStack />
    </NavigationContainer>
  );
}

function Root() {
  /* const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function fetchToken() {
      await SplashScreen.preventAutoHideAsync();
      const storageToken = await AsyncStorage.getItem("token");

      if (storageToken) {
        authCtx.authenticate(storageToken);
      }

      await SplashScreen.hideAsync();
    }
    fetchToken();
  }, []); */

  return <Navigation />;
}

export default function App() {
  const [isReady, setIsReady] = useState(false);
  /* const preloadAssets = () => {
    const fontToLoad = [Ionicons.font];
    const fontPromises = fontToLoad.map((font: any) => Font.loadAsync(font));

    const imagesToLoad = [require("./assets/picture/meRecord/Spoon.svg")];

    const imagePromises = imagesToLoad.map((image) => Asset.loadAsync(image));
    return Promise.all<void | Asset[]>([...fontPromises, ...imagePromises]);
  }; */
  const fetchFonts = () => {
    return Font.loadAsync({
      "Pretendard-Bold": require("./assets/font/pretendard/Pretendard-Bold.otf"),
      "Pretendard-SemiBold": require("./assets/font/pretendard/Pretendard-SemiBold.otf"),
      "Pretendard-Regular": require("./assets/font/pretendard/Pretendard-Regular.otf"),
      "Pretendard-Medium": require("./assets/font/pretendard/Pretendard-Medium.otf"),
    });
  };

  const preLoad = async () => {
    return await fetchFonts();
  };
  /* const preLoad = async () => {
    return await Promise.all([fetchFonts() , preloadAssets()]);
  }; */
  useEffect(() => {
    preLoad().then((context) => {
      setIsReady(true);
      SplashScreen.hideAsync();
    });
  }, []);

  if (!isReady) {
    return null; // 또는 로딩 화면을 렌더링
  }

  return (
    <RecoilRoot>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
          <StatusBar style="dark" />
          <AuthContextProvider>
            <Root />
          </AuthContextProvider>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </RecoilRoot>
  );
}
const styles = StyleSheet.create({
  indicatorStyle: {
    backgroundColor: "blue",
    width: "90%", // 인디케이터의 너비를 90%로 설정하여 여백 생성
    marginLeft: "5%", // 인디케이터의 좌측 여백
    marginRight: "5%", // 인디케이터의 우측 여백
  },
});
