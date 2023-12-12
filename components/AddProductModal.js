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
import { Picker } from "@react-native-picker/picker";

import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import firebaseConfig from "../firebaseConfig";

export default function AddProductModal({
  setVisibility,
  visibility,
  id,
  locations,
  reload,
}) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [location, setLocation] = useState("");
  const db = getFirestore(firebaseConfig);

  async function AddProduct() {
    try {
      const list = doc(db, "Listen", id);

      if (name == "") {
        throw new Error("Product name is empty");
      }

      if (amount == "") {
        throw new Error("amount is empty");
      }

      const produkt = {
        Gekauft: false,
        Menge: amount,
        Name: name,
        Ort: location,
      };

      await updateDoc(list, {
        Produkte: arrayUnion(produkt),
      });
      Toast.show("Added Product", {
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
            <Text style={styles.header}>Add Product</Text>
          </View>
          <View style={styles.inputmain}>
            <Text style={styles.text}>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setName(text)}
            ></TextInput>
          </View>
          <View style={styles.inputmain}>
            <Text style={styles.text}>Amount</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setAmount(text)}
            ></TextInput>
          </View>
          <Picker
            style={styles.locationPicker}
            selectedValue={location}
            onValueChange={(itemValue, itemIndex) => setLocation(itemValue)}
          >
            <Picker.Item
              label={"No Location"}
              value={""}
              color="white"
            ></Picker.Item>
            {locations &&
              locations.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.Name}
                  value={item.Name}
                  color="white"
                />
              ))}
          </Picker>

          <View style={styles.btnContainer}>
            <ActiveButton
              text={"Add"}
              onPress={async () => {
                AddProduct();
                await reload();
                setVisibility(false);
              }}
            ></ActiveButton>
            <PassiveButton
              text={"Close"}
              onPress={() => {
                setVisibility(false);
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
    height: 680,
    marginTop: 100,
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
  locationPicker: {},
  btnContainer: {
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
    height: "100%",
  },
});
