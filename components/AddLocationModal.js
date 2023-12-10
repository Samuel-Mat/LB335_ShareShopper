import { useState, useRef, useEffect } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  TextInput,
  Image,
  Modal,
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
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";

import ActiveButton from "./ActiveButton";
import PassiveButton from "./PassiveButton";
import firebaseConfig from "../firebaseConfig";

export default function AddLocationModal({
  setVisibility,
  visibility,
  id,
  reload,
}) {
  const [name, setName] = useState("");
  const [mapRegion, setRegion] = useState(null);
  const [geoLocation, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setRegion({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
      setLocation({
        longitude: location.coords.longitude,
        latitude: location.coords.latitude,
      });
    })();
  }, []);

  const db = getFirestore(firebaseConfig);
  const auth = getAuth();

  async function AddLocation() {
    try {
      const list = doc(db, "Listen", id);

      if (name == {}) {
        throw new Error("location name is empty");
      }
      const ort = {
        Name: name,
        Geopunkt: {
          latitude: geoLocation.latitude,
          longitude: geoLocation.longitude,
        },
      };

      await updateDoc(list, {
        Orte: arrayUnion(ort),
      });
      Toast.show("Added Location", {
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
    <Modal animationType="slide" transparent={true} visible={visibility}>
      <View style={styles.main}>
        <View style={styles.textContainer}>
          <Text style={styles.header}>Add Location</Text>
        </View>
        <View style={styles.inputmain}>
          <Text style={styles.text}>Location Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setName(text)}
          ></TextInput>
        </View>
        <View style={styles.mapContainer}>
          <View style={styles.map}>
            <MapView
              style={{ alignSelf: "stretch", height: "100%" }}
              region={mapRegion}
            >
              <Marker
                draggable
                coordinate={geoLocation}
                onDragEnd={(e) => {
                  setLocation({
                    latitude: e.nativeEvent.coordinate.latitude,
                    longitude: e.nativeEvent.coordinate.longitude,
                  });
                  console.log(geoLocation);
                }}
              />
            </MapView>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <ActiveButton
            text={"Add"}
            onPress={async () => {
              AddLocation();
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#070A0D",
    display: "flex",
    width: "90%",
    height: "90%",
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
    marginTop: "10%",
    width: "80%",
    marginLeft: "10%",
    alignItems: "center",
    height: "80%",
  },
  map: {
    width: "80%",
    height: "100%",
  },
  mapContainer: {
    width: "100%",
    height: "40%",
    alignItems: "center",
  },
});
