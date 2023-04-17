import React, {useState, useEffect } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native"

const initialState = {
  name: "",
  place: "",
}

const CreatePostsScreen = ({ navigation }) => {
  const [permissions, setPermissions] = useState({ location: "granted", camera: "granted" });

  const [state, setState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const isFocused = useIsFocused();
  
useEffect(() => {
  (async () => {
    const [locationStatus, cameraStatus] = await Promise.all([
      Location.requestForegroundPermissionsAsync(),
      Camera.requestCameraPermissionsAsync(),
    ]);
    setPermissions({ location: locationStatus.status === 'granted', camera: cameraStatus.status === 'granted' });
  })();
}, []);

if (permissions.location === null || permissions.camera === null) {
  return <View />;
}

if (!permissions.location || !permissions.camera) {
  return (
    <View>
      {!permissions.location && <Text>No access to location</Text>}
      {!permissions.camera && <Text>No access to camera</Text>}
    </View>
  );
}

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      const location = await Location.getCurrentPositionAsync();
      console.log("latitude", location.coords.latitude);
      console.log("longitude", location.coords.longitude);
      setPhoto(photo.uri);
    }
  };

  console.log("photo", photo);

  const sendPhoto = async () => {
      navigation.navigate("DefaultScreenPosts", { photo });
  };

  return (
    <View style={styles.container}>
      {isFocused && (
      <Camera style={[styles.camera, { borderRadius: 8 }]} ref={setCamera}>
        {photo && (
          <View style={[styles.photoContainer, { borderRadius: 8 }]}>
            <Image 
              sourse={{ uri: photo }} 
              style={{ width: 343, height: 240, borderRadius: 8 }}
            />
          </View>
        )}
          <TouchableOpacity style={styles.snapContainer} onPress={takePhoto}>
            <Feather name="camera" size={24} color="#BDBDBD" 
              />
          </TouchableOpacity>
        </Camera>
      )}
      <View style={{ width: "100%", marginLeft: 64, }}>
        <TextInput
            style={{ marginTop: 47, fontSize: 16,  fontWeight: 'bold'}}
            placeholder="Назва"
            placeholderTextColor={"#212121"}
            onFocus={() => setIsShowKeyboard(true)}
            onChangeText={(value) => setState((prevState) => ({...prevState, name: value}))}
        />
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Feather name="map-pin" size={16} color="#BDBDBD" />
          <TextInput
              style={{ marginTop: 47, fontSize: 14, }}
              placeholder="Місцевість"
              placeholderTextColor={"#212121"}
              onFocus={() => setIsShowKeyboard(true)}
              onChangeText={(value) => setState((prevState) => ({...prevState, place: value}))}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
          <Text style={styles.sendLabel}>Publish</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  camera: {
    marginTop: 92,
    height: 240,
    width: 343,
    alignItems: "center",
    backgroundColor: "#E8E8E8",
  },
  snapContainer: {
    marginTop: 90,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center"
  },
  photoContainer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  sendBtn: {
    width: 343,
    height: 51,
    backgroundColor: "#FF6C00",
    padding: 16,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 47,
    marginBottom: 16,
    },
  sendLabel: {
    color: "#fff",
    fontWeight: "400",
    fontSize: 16,
    },
});



export default CreatePostsScreen;