import React, {useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { View, StyleSheet, Image, Text, TouchableOpacity, TextInput, Keyboard, ImageBackground } from "react-native";
import { Camera } from 'expo-camera';
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import * as Location from "expo-location";
import { useIsFocused } from "@react-navigation/native";
import { storage, app, db } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore"; 
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';


const initialState = {
  name: "",
  place: "",
}

const CreatePostsScreen = ({ navigation }) => {
  const [permissions, setPermissions] = useState({ location: "granted", camera: "granted", media: "granted" });


  const [localState, setLocalState] = useState(initialState);
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [location, setLocation] = useState(null);
  const [camera, setCamera] = useState(null);
  const [photo, setPhoto] = useState(null);
  const isFocused = useIsFocused();

  const { userId, email, login } = useSelector((store) => store.auth);
  
  useEffect(() => {
    (async () => {
      const [locationStatus, cameraStatus, mediaStatus] = await Promise.all([
        Location.requestForegroundPermissionsAsync(),
        Camera.requestCameraPermissionsAsync(),
        MediaLibrary.requestPermissionsAsync(),
      ]);
      setPermissions({ location: locationStatus.status === 'granted', camera: cameraStatus.status === 'granted', media: mediaStatus.status === 'granted' });
    })();
  }, []);
  
  if (permissions.location === null || permissions.camera === null || permissions.media === null) {
    return <View />;
  }
  
  if (!permissions.location || !permissions.camera || !permissions.media === null) {
    return (
      <View>
        {!permissions.location && <Text>No access to location</Text>}
        {!permissions.camera && <Text>No access to camera</Text>}
        {!permissions.media && <Text>No access to media library</Text>}
      </View>
    );
  }

if (permissions.location === null || permissions.camera === null || permissions.media === null) {
  return <View />;
}

if (!permissions.location || !permissions.camera || !permissions.media === null) {
  return (
    <View>
      {!permissions.location && <Text>No access to location</Text>}
      {!permissions.camera && <Text>No access to camera</Text>}
      {!permissions.media && <Text>No access to media library</Text>}
    </View>
  );
}

  const takePhoto = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();      
      const locationRes = await Location.getCurrentPositionAsync();
      setLocation(locationRes);
  
      const asset = await MediaLibrary.createAssetAsync(photo.uri);
  
      const albumName = 'DCIM';
      const album = await MediaLibrary.getAlbumAsync(albumName);
      const assets = await MediaLibrary.getAssetsAsync({ album: album.id });
      const foundAsset = assets.assets.find((a) => a.filename === asset.filename);
      if (foundAsset) {
        setPhoto(foundAsset.uri);
      } else {
        console.log('Asset not found');
      }
    }
  };

const uploadPhotoFromStorage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    });
    
    if (result) {
      setPhoto(result.assets[0].uri);
    }
};

  const changePhoto = async (photoUri) => {
          setPhoto(null);
  };

  const sendPhoto = async () => {
    const photoURL = await uploadPhotoToServer(photo);
      uploadPostToServer(photoURL);
      navigation.navigate("DefaultScreenPosts");
      setPhoto(null);
      setLocalState({
        name: "",
        place: "",
      });
  };

  const uploadPostToServer = async (photoURL) => {
      const createPost = await addDoc(collection(db, "posts"), {
        name: localState.name,
        place: localState.place,
        location: location.coords,
        photo: photoURL,
        userId, 
        login,
        email,
      });
  }

  const uploadPhotoToServer = async (photo) => {
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
                    source={{ 
                      uri: `${photo}` 
                  }} 
                    style={{ width: 343, height: 240, borderRadius: 8, resizeMode: "cover" }}
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
        {photo ? (
            <TouchableOpacity style={styles.actionContainer} onPress={() => changePhoto(photo)}>
              <Text style={styles.actionText}>Редагувати фотографію</Text>
            </TouchableOpacity> 
        ) : (
          <TouchableOpacity style={styles.actionContainer} 
          onPress={uploadPhotoFromStorage}
          >
            <Text style={styles.actionText}>Завантажте фотографію</Text>
          </TouchableOpacity>
        )}
        <TextInput
            style={styles.nameInput}
            placeholder="Назва..."
            placeholderTextColor={"#BDBDBD"}
            onFocus={() => setIsShowKeyboard(true)}
            value={localState.name}
            onChangeText={(value) => setLocalState((prevState) => ({...prevState, name: value}))}
        />
        <View style={styles.mapContainer}>
          <Feather name="map-pin" size={16} color="#BDBDBD" style={{marginRight: 6}}/>
          <TextInput
              style={styles.mapInput}
              placeholder="Місцевість..."
              placeholderTextColor={"#BDBDBD"}
              onFocus={() => setIsShowKeyboard(true)}
              value={localState.place}
              onChangeText={(value) => setLocalState((prevState) => ({...prevState, place: value}))}
          />
        </View>
      </View>
      <TouchableOpacity disabled={!localState.name || !localState.place || !photo} style={[styles.sendBtn, !localState.name || !localState.place ? styles.sendBtnUnactive : styles.sendBtnActive]} onPress={sendPhoto}>
          <Text style={[styles.sendLabel, !localState.name || !localState.place ? styles.sendLabelUnactive : styles.sendLabelActive]}> Опублікувати</Text>
      </TouchableOpacity>  
      <TouchableOpacity style={styles.deleteBtn} onPress={() => navigation.navigate("PostsScreen")}>
          <AntDesign name="delete" size={24} color="#BDBDBD" />
      </TouchableOpacity>      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingLeft: 32,
    paddingRight: 32,
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
    alignItems: "center",
  },
  photoContainer: {
    position: "absolute",
    left: 0,
    top: 0,
  },
  sendBtn: {
    width: 343,
    height: 51,
    padding: 15,
    borderRadius: 100,
    alignItems: "center",
    marginTop: 47,
    marginBottom: 16,
    },
  sendBtnUnactive: {
    backgroundColor: "#F6F6F6",
  },
  sendBtnActive: {
    backgroundColor: "#FF6C00",
  },
  deleteBtn: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: "center",
    width: 70,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    marginTop: 120,
  },
  sendLabel: {
    fontWeight: "400",
    fontSize: 16,
    },
  sendLabelUnactive: {
    color: "#BDBDBD",
    },
  sendLabelActive: {
    color: "#fff",
    },
  textContainer: { 
    width: "100%", 
  },
  nameInput: { 
    marginTop: 48, 
    fontSize: 16,  
    fontWeight: '500',
    color: "#212121",
  },
  mapContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginTop: 47,
  },
  mapInput: {
    fontSize: 14, 
    marginLeft: 7,
    color: "#212121",
  },
  actionText: {
    marginTop: 8, 
    fontSize: 16,  
    color: "#BDBDBD",
  },
  actionContainer: {
    marginRight: "auto",
  },
});



export default CreatePostsScreen;