import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-root-toast";

import firebaseConfig from "../firebaseConfig";
import TextInputField from "./TextInputField";
import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import Header from "./Header";

export default function LoginScreen({ onpressActive, onpressPassive }) {
  const [state, setState] = useState({ email: "", password: "" });
  const auth = getAuth();

  const SignIn = async () => {
    signInWithEmailAndPassword(auth, state.email, state.password)
      .then(() => {
        Toast.show("Login successful", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 100,
        });
      })
      .catch((error) => {
        Toast.show("Bad Request \n " + error.code + error.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "red",
          opacity: 100,
        });
      });
  };

  function CheckLogin() {
    if (auth.currentUser == undefined) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    const success = CheckLogin();
    console.log("Success: " + success);

    if (success) {
      onpressActive();
    }
  }, []);

  return (
    <ScrollView style={styles.scrollV}>
      <View style={styles.all}>
        <Header style={styles.logo}></Header>
        <View style={styles.content}>
          <View style={styles.main}>
            <Text style={styles.header}>Login</Text>
            <View style={styles.inputmain}>
              <Text style={styles.inputtext}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setState({ email: text, password: state.password })
                }
              ></TextInput>
            </View>
            <View style={styles.inputmain}>
              <Text style={styles.inputtext}>Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setState({ email: state.email, password: text })
                }
                secureTextEntry={true}
              ></TextInput>
            </View>
          </View>
          <ActiveButton
            style={styles.btn}
            onPress={() => {
              SignIn();
              onpressActive();
            }}
            text="Login"
          ></ActiveButton>
          <PassiveButton
            style={styles.btn}
            onPress={onpressPassive}
            text="Register"
          ></PassiveButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollV: {
    height: "100%",
    width: "100%",
    backgroundColor: "#070A0D",
  },
  all: {
    height: "100%",
    width: "100%",
    backgroundColor: "#070A0D",
    marginTop: "7%",
  },
  content: {
    alignItems: "center",
    width: "100%",
    height: "80%",
    backgroundColor: "#070A0D",
  },
  main: {
    width: "100%",
    height: "60%",
    marginBottom: 50,
  },
  header: {
    fontSize: 40,
    color: "white",
    marginLeft: "10%",
    fontWeight: 300,
    marginBottom: 50,
  },
  btn: {
    marginBottom: 50,
  },
  inputmain: {
    backgroundColor: "#070A0D",
    marginLeft: "10%",
    marginBottom: 60,
  },
  inputtext: {
    color: "white",
  },
  input: {
    color: "white",
    fontSize: 20,
    marginTop: 10,
    width: "80%",
    height: 50,
    backgroundColor: "#18212F",
    padding: 10,
    borderColor: "#6482AF",
    borderWidth: 1,
  },
});
