//Library imports
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { RootSiblingParent } from "react-native-root-siblings";
import { useState } from "react";

//Screens
import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen";
import Home from "./components/HomeScreen";
import NewList from "./components/NewListScreen";
import Detail from "./components/DetailScreen";

//Password: 12345test
//import all different screens as Navigation Function

/*
Sources for this Project
Everything about firebase: https://firebase.google.com/docs?hl=de
Toast: https://www.npmjs.com/package/react-native-root-toast
React Navigation: https://reactnavigation.org/docs/getting-started/
Maps: https://blog.logrocket.com/react-native-maps-introduction/
Dropdown: https://github.com/AdelRedaa97/react-native-select-dropdown
GeoLocation: https://docs.expo.dev/versions/latest/sdk/location/
Checkbox: https://docs.expo.dev/versions/latest/sdk/checkbox/
*/

export default function App() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [chosenList, setList] = useState({});

  function Login({ navigation }) {
    return (
      <LoginScreen
        onpressActive={() => {
          success = CheckLogin();
          console.log(success);
          if (!success) {
            navigation.navigate("Login");
          } else {
            navigation.navigate("Home");
          }
        }}
        onpressPassive={() => {
          navigation.navigate("Register");
        }}
      ></LoginScreen>
    );
  }

  function CheckLogin() {
    if (auth.currentUser == undefined) {
      return false;
    }
    return true;
  }

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Benutzer ist angemeldet
      CheckLogin();
      setUser(user);
    }
  });

  function Register({ navigation }) {
    return (
      <RegisterScreen
        onpressActive={() => {
          CheckRegistration();
          navigation.navigate("Login");
        }}
        onpressPassive={() => {
          navigation.navigate("Login");
        }}
      ></RegisterScreen>
    );
  }

  function NewListScreen({ navigation }) {
    return (
      <NewList
        onpressActive={() => navigation.navigate("Home")}
        onpressPassive={() => navigation.navigate("Home")}
      ></NewList>
    );
  }

  function HomeScreen({ navigation }) {
    return (
      <Home
        setList={setList}
        navigateToList={() => {
          navigation.navigate("DetailScreen");
        }}
        onpressPassive={() => {
          navigation.navigate("Login");
        }}
        newListNavigation={() => {
          navigation.navigate("NewList");
        }}
      ></Home>
    );
  }

  function CheckRegistration() {}

  function DetailScreen({ navigation }) {
    return (
      <Detail
        listdata={chosenList}
        navigateBack={() => {
          navigation.navigate("Home");
        }}
      ></Detail>
    );
  }

  const Stack = createNativeStackNavigator();

  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Register"
            component={Register}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NewList"
            component={NewListScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailScreen"
            component={DetailScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
