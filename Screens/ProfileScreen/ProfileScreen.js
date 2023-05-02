import React, {useEffect, useState} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ImageBackground, TextInput } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from '@expo/vector-icons';
import { db } from "../../firebase/config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
// import ImagePicker from 'react-native-image-picker';


const ProfileScreen = ({navigation}) => {
    const dispatch = useDispatch();
    const { userId, login } = useSelector((state) => state.auth);

    const [userPosts, setUserPosts] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        getUserPosts();
    }, [])

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
        // ImagePicker.launchImageLibrary(options, (response) => {
        //   console.log(response);
        // });
      };

    return (
    <ImageBackground
    style={styles.image}
    source={require('../../assets/BG.png')}
    >
        <View style={styles.container}>
            <View style={styles.avatar}>
                    <TouchableOpacity style={styles.addIconContainer} onPress={selectImage}>
                        <Image style={styles.addIcon} source={require('../../assets/del.png')} />
                    </TouchableOpacity>
            </View>
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
                                <TouchableOpacity onPress={() => navigation.navigate("CommentsScreen", {postId: item.id})}> 
                                    <Feather name="message-circle" size={18} color="#BDBDBD" />
                                </TouchableOpacity>
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
    backgroundColor: "#F6F6F6",
    zIndex: 999,
}, 
addIconContainer: {
    position: 'absolute',
    top: 80,
    right: -12,
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
    fontWeight: 'bold'
    },
iconContainer: {
    flexDirection: 'row', 
    alignItems: 'center',  
    marginTop: 11,  
    justifyContent: 'space-between'
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