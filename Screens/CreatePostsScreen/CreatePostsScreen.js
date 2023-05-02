import React, {useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Keyboard } from "react-native";
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { storage, app, db } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 


const initialState = {
  name: "",
  place: "",
}

const CreatePostsScreen = ({ navigation }) => {
  const [permissions, setPermissions] = useState({ location: "granted", camera: "granted" });

  const [localState, setLocalState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [location, setLocation] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const isFocused = useIsFocused();

  const { userId, email, login } = useSelector((store) => store.auth);
  
  console.log(userId, email, login)
  
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
      console.log("photo", photo);
      const locationRes = await Location.getCurrentPositionAsync();
      setLocation(locationRes);
      setPhoto(photo.uri);
    }
  };

  const sendPhoto = async () => {
      uploadPhotoToServer();
      uploadPostToServer();
      navigation.navigate("DefaultScreenPosts");
      setPhoto(null);
      setLocalState({
        name: "",
        place: "",
      });
  };

  const uploadPostToServer = async () => {
      const photoURL = await uploadPhotoToServer();
      const createPost = await addDoc(collection(db, "posts"), {
        name: localState.name,
        place: localState.place,
        location: location.coords,
        photo: photoURL,
        userId, 
        login,
        email,
      });
      // console.log("localState.name", localState.name, "localState.place", localState.place, "location.coords", location.coords, "photoURL", photoURL, userId, login, email );
  }

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(photo);
      const file = await response.blob();
      const uniquePostId = Date.now().toString();
      const storage = getStorage(app);
      const storageRef = ref(storage, `postImage/${uniquePostId}`);
      await uploadBytes(storageRef, file);
  
      const photoURL = await getDownloadURL(storageRef);
      return photoURL;
    } catch (error) {
      console.log(error);
    }
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
      <View style={styles.textContainer}>
        <TextInput
            style={styles.nameInput}
            placeholder="Назва..."
            placeholderTextColor={"#212121"}
            onFocus={() => setIsShowKeyboard(true)}
            onChangeText={(value) => setLocalState((prevState) => ({...prevState, name: value}))}
        />
        <View style={styles.mapContainer}>
          <Feather name="map-pin" size={16} color="#BDBDBD" style={{marginRight: 6}}/>
          <TextInput
              style={styles.mapInput}
              placeholder="Місцевість..."
              placeholderTextColor={"#212121"}
              onFocus={() => setIsShowKeyboard(true)}
              onChangeText={(value) => setLocalState((prevState) => ({...prevState, place: value}))}
          />
        </View>
      </View>
      <TouchableOpacity style={styles.sendBtn} onPress={sendPhoto}>
          <Text style={styles.sendLabel}>Опублікувати</Text>
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
    marginTop: 32,
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
  textContainer: { 
    width: "100%", 
    marginLeft: 64, 
  },
  nameInput: { 
    marginTop: 47, 
    fontSize: 16,  
    fontWeight: 'bold'
  },
  mapContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 47
  },
  mapInput: {
    fontSize: 14, 
    marginLeft: 7 
  }
});



export default CreatePostsScreen;