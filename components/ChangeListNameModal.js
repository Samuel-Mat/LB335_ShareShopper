import { useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import {
  getFirestore,
  collection,
  updateDoc,
  doc,
  where,
  query,
  arrayUnion,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Toast from "react-native-root-toast";

import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import firebaseConfig from "../firebaseConfig";

export default function ChangeListNameModal({
  setVisibility,
  visibility,
  id,
  reload,
}) {
  const [name, setName] = useState("");
  const db = getFirestore(firebaseConfig);
  const auth = getAuth();

  async function ChangeName() {
    try {
      const list = doc(db, "Listen", id);

      if (name == "") {
        throw new Error("Name is empty");
      }

      await updateDoc(list, {
        Name: name,
      });
      Toast.show("Changed Name", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "green",
        opacity: 100,
      });
    } catch (e) {
      Toast.show("Bad Request \n " + e.message, {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        backgroundColor: "red",
        opacity: 100,
      });
    }
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibility}
      supportedOrientations={["portrait", "landscape"]}
    >
      <ScrollView>
        <View style={styles.main}>
          <View style={styles.textContainer}>
            <Text style={styles.header}>Change Name</Text>
          </View>
          <View style={styles.inputmain}>
            <Text style={styles.text}>New Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setName(text)}
            ></TextInput>
          </View>
          <View style={styles.btnContainer}>
            <ActiveButton
              text={"Change"}
              onPress={async () => {
                ChangeName();
                await reload();
                setVisibility(false);
                setName("");
              }}
            ></ActiveButton>
            <PassiveButton
              text={"Close"}
              onPress={() => {
                setVisibility(false);
                setName("");
              }}
            ></PassiveButton>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#070A0D",
    display: "flex",
    width: "90%",
    height: "100%",
    marginTop: 50,
    borderColor: "#6482AF",
    borderWidth: 3,
    marginLeft: "5%",
    borderRadius: 40,
  },
  header: {
    color: "white",
    fontSize: 30,
    marginTop: 10,
  },
  textContainer: {
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 24,
    marginRight: "30%",
    marginTop: 20,
  },
  logo: {
    width: 80,
    height: 60,
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
    width: "90%",
    height: 50,
    backgroundColor: "#18212F",
    padding: 10,
    borderColor: "#6482AF",
    borderWidth: 1,
  },
  btnContainer: {
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
    height: "140%",
  },
});
