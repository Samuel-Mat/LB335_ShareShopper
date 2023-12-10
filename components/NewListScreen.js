import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
} from "react-native";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../firebaseConfig";
import { useState } from "react";
import Toast from "react-native-root-toast";
import { collection, addDoc, getFirestore } from "firebase/firestore";

import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";

export default function NewListScreen({ onpressActive, onpressPassive }) {
  const auth = getAuth(firebaseConfig);
  const db = getFirestore(firebaseConfig);
  const [listName, setName] = useState("");
  const [users, setUser] = useState([]);
  const [singleUser, setsingleUser] = useState("");

  async function AddUserToList() {
    try {
      const newUser = singleUser;
      const oldUsers = users;
      let allUsers = [];
      if (users == []) {
        allUsers.push(singleUser);
      } else {
        allUsers = users;
        allUsers.push(singleUser);
      }
      console.log(allUsers);
      setUser(allUsers);
      Toast.show("Added User successful", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "green",
        opacity: 100,
      });
    } catch (error) {
      Toast.show("Something went wrong: \n" + error.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        opacity: 100,
      });
    }
  }

  async function CreateList() {
    try {
      if (listName == "") {
        throw new Error("You forgot the name");
      }
      const docRef = await addDoc(collection(db, "Listen"), {
        Admin: auth.currentUser.uid,
        Name: listName,
        Nutzer: users,
        Orte: [{ Name: "GPS", Geopunkt: { latitude: 0, longitude: 0 } }],
        Produkte: [],
      });
      Toast.show("Added List successful", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "green",
        opacity: 100,
      });
    } catch (e) {
      Toast.show("Something went wrong: \n" + e.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        opacity: 100,
      });
    }
  }

  return (
    <View style={styles.content}>
      <View style={styles.main}>
        <Text style={styles.header}>New List</Text>
        <View style={styles.inputmain}>
          <Text style={styles.inputtext}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
          ></TextInput>
        </View>
        <View style={styles.inputmain}>
          <Text style={styles.inputtext}>Users</Text>
          <TextInput
            inputMode="email"
            textContentType="emailAddress"
            style={styles.input}
            onChangeText={(text) => {
              setsingleUser(text);
            }}
          ></TextInput>
          <Pressable onPress={AddUserToList} style={styles.addUserbtn}>
            <Image
              style={styles.addUserImg}
              source={require("../assets/addUser.png")}
            ></Image>
          </Pressable>
        </View>
      </View>
      <ActiveButton
        style={styles.btn}
        onPress={async () => {
          CreateList();
          onpressActive();
        }}
        text="Create"
      ></ActiveButton>
      <PassiveButton
        style={styles.btn}
        onPress={async () => {
          onpressPassive();
        }}
        text="Back to Home"
      ></PassiveButton>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignItems: "center",
    width: "100%",
    height: "100%",
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
    marginTop: 100,
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
  addUserImg: {
    width: "50%",
  },
  addUserbtn: {
    width: 50,
    height: 30,
    backgroundColor: "#6482AF",
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
