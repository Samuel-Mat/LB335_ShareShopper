import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { useState } from "react";
import Toast from "react-native-root-toast";

import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import Header from "./Header";

export default function RegisterScreen({ onpressActive, onpressPassive }) {
  const auth = getAuth(firebaseConfig);

  const [state, setState] = useState({ email: "", password: "" });

  const CreateUser = () => {
    createUserWithEmailAndPassword(auth, state.email, state.password)
      .then((userCredential) => {
        Toast.show("Registration successful", {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "green",
          opacity: 100,
        });
        const user = userCredential.user;
        return user;
      })
      .catch((error) => {
        Toast.show("Bad Request \n " + error.code + error.message, {
          duration: Toast.durations.LONG,
          position: Toast.positions.TOP,
          backgroundColor: "red",
          opacity: 100,
        });
        // ..
      });
    return "";
  };
  return (
    <ScrollView style={styles.scrollV}>
      <View style={styles.all}>
        <Header></Header>
        <View style={styles.content}>
          <View style={styles.main}>
            <Text style={styles.header}>Register</Text>
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
              CreateUser();
              onpressActive();
            }}
            text="Register"
          ></ActiveButton>
          <PassiveButton
            style={styles.btn}
            onPress={onpressPassive}
            text="Back to Login"
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
    marginBottom: 20,
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
