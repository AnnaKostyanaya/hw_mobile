import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 
import { db } from "../../firebase/config";
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { app } from "../../firebase/config";
import { updateProfileWithAvatar, authSignOutUser } from "../../redux/auth/authOperations";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { authSlice } from "../../redux/auth/authReducer";
import { SvgXml } from 'react-native-svg';
import CommentCount from "../../component/CommentCount";
import LikesCount from "../../component/LikesCount";

const xmlAdd = `
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(45, 18.5, 18.5)">
            <circle cx="18.4999" cy="18.5" r="12" fill="white" stroke="#E8E8E8"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2574 13.5503L13.5503 14.2574L17.7929 18.5L13.5503 22.7426L14.2574 23.4497L18.5 19.2071L22.7426 23.4497L23.4498 22.7426L19.2071 18.5L23.4498 14.2574L22.7426 13.5503L18.5 17.7929L14.2574 13.5503Z" fill="red"/>
        </g>
    </svg>
`;
const xmlDel = `
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="18.4999" cy="18.5" r="12" transform="rotate(-45 18.4999 18.5)" fill="white" stroke="#E8E8E8"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2574 13.5503L13.5503 14.2574L17.7929 18.5L13.5503 22.7426L14.2574 23.4497L18.5 19.2071L22.7426 23.4497L23.4498 22.7426L19.2071 18.5L23.4498 14.2574L22.7426 13.5503L18.5 17.7929L14.2574 13.5503Z" fill="#BDBDBD"/>
    </svg>
`;

const ProfileScreen = ({navigation}) => {
    const { updateSelectedImage } = authSlice.actions;
    const dispatch = useDispatch();
    const { userId, login, email } = useSelector((state) => state.auth);

    const [userPosts, setUserPosts] = useState([]);
    const { photoURL } = useSelector((state) => state.auth);

    useEffect(() => {
        getUserPosts();
    }, [])
    
    const signOut = () => {
        dispatch(authSignOutUser());
    };

    const getUserPosts = () => {
        const postsCollection = collection(db, "posts");
        const q = query(postsCollection, where("userId", "==", userId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const posts = [];
            querySnapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
            });
            setUserPosts(posts);
        });
        return () => unsubscribe();
    }

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            });
            
            if (result) {
                const photoURL = await uploadPhotoToServer(result.assets[0].uri);
                await dispatch(updateSelectedImage(photoURL));
                await dispatch(updateProfileWithAvatar(photoURL));
            }
            };
    
    const uploadPhotoToServer = async (image) => {
        try {
            const response = await fetch(image);
            const file = await response.blob();
            const uniqueUserId = Date.now().toString();
            const storage = getStorage(app);
            const storageRef = ref(storage, `userImage/${uniqueUserId}`);
            await uploadBytes(storageRef, file);
        
            const photoURL = await getDownloadURL(storageRef);
            return photoURL;
            } catch (error) {
            console.log(error);
            }
        };
    
    return (
    <ImageBackground
    style={styles.image}
    source={require('../../assets/BG.png')}
    >
        <View style={styles.container}>
            <View style={styles.avatar}>
                {photoURL && <Image style={styles.avatarPhoto} source={{ uri: photoURL }} />}
                <TouchableOpacity style={styles.addIconContainer} onPress={selectImage}>
                    {photoURL && 
                    <SvgXml xml={xmlDel} />
                    }
                    {!photoURL &&
                    <SvgXml xml={xmlAdd} />
                    }
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={signOut} style={styles.singOutContainer}>
                    <AntDesign name="logout" size={24} color="#BDBDBD" />
            </TouchableOpacity>
            <View style={styles.textCont}>
                <Text style={styles.textReg}>{login}</Text>
            </View>
            
            <FlatList
                    data={userPosts}
                    keyExtractor={(item, indx) => indx.toString()}
                    renderItem={({ item }) => (
                    <View
                        style={styles.postContainer}
                    >
                        <Image
                        source={{ uri: item.photo }}
                        style={styles.imageContainer}
                        />
                        <View  style={styles.describeContainer}>
                            <Text title="Name" style={styles.textName}>{item.name}</Text>
                            <View style={styles.iconContainer}>
                                <View style={styles.iconContainer}>
                                    <TouchableOpacity style={[styles.iconContainer, { marginRight: 27 }]} onPress={() => navigation.navigate("CommentsScreen", {postId: item.id, postPhoto: item.photo})}> 
                                        <CommentCount postId={item.id}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconContainer} onPress={() => likeSend(item.id)}>
                                        <LikesCount postId={item.id}/>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("MapScreen", {location: item.location})} style={styles.locationContainer}> 
                                    <Feather name="map-pin" size={18} color="#BDBDBD" style={{marginRight: 6}}/>
                                    <Text style={styles.locationName}>{item.place}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    )}
                />
        </View>
    </ImageBackground>
    );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 147,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    },
singOutContainer: {
    position: "absolute",
    top: 17,
    right: 30,
},
image: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "flex-end",
        },
avatar: {
    width: 120,
    height: 120,
    position: "absolute",
    top: -60,
    left: "48%",
    transform: [{ translateX: parseInt("-50%") }],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "#F6F6F6",
    zIndex: 999,
}, 
avatarPhoto: {
    width: 120, 
    height: 120,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
},
addIconContainer: {
    position: 'absolute',
    top: 70,
    right: -18,
    zIndex: 999,
    
},
addIcon: {
    width: 25,
    height: 25,
},  
textCont: {
    marginTop: 92,
    marginBottom: 32,
},
textReg: {
    color: "#212121",
    fontSize: 30,
    textAlign: "center",
    fontWeight: "500",
},
postContainer: {
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
    },
imageContainer: { 
    width: 343, 
    height: 240, 
    borderRadius: 8, 
    },
describeContainer: { 
    marginTop: 8, 
    width: "100%", 
    marginLeft: 8, 
    marginRight: 8, 
    justifyContent: "space-evenly"
    },
textName: { 
    fontSize: 16,  
    fontWeight: 'bold',
    marginBottom: 11, 
    },
iconContainer: {
    flexDirection: 'row', 
    alignItems: 'center',  
    justifyContent: 'space-between'
    },
iconText: {
    marginLeft: 10, 
},
locationName: { 
    fontSize: 16, 
    marginLeft: 7, 
    textDecorationLine: 'underline',
    },
locationContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    }, 
});

export default ProfileScreen;