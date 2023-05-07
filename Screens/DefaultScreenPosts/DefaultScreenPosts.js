import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { db } from "../../firebase/config";
import { collection, onSnapshot, addDoc, query, orderBy, querySnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import CommentCount from "../../component/CommentCount";
import LikesCount from "../../component/LikesCount";

const DefaultScreenPosts = ({ route, navigation }) => {

    const [posts, setPosts] = useState([]);
    const { email, login, photoURL, userId } = useSelector((store) => store.auth);

    const getAllPosts = async () => {
        onSnapshot(collection(db, "posts"), 
            (snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
                posts.push({ ...doc.data(), id: doc.id });
            });
            setPosts(posts);
            });
        };

    useEffect(() => {
        getAllPosts();
    }, []);


    const likeSend = async (postId) => {
        try {
            const likesRef = collection(db, "posts", postId, "likes");
            const newLikeRef = await addDoc(likesRef, { login, userId });
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <View style={styles.avatar}>
                    {photoURL && <Image style={styles.avatarPhoto} source={{ uri: photoURL }} />}
                </View>
                <View style={styles.textName}>
                    <Text style={styles.login}>{login}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>
            </View>
            <View style={styles.collectionContainer}>
                <FlatList
                    data={posts}
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
        </View>
    );
};

const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: "#fff",
    },
profileContainer: {
    flexDirection: 'row',
    marginLeft: 32, 
    marginBottom: 32,
    marginTop: 32,
    alignItems: 'center',
},
textName: {
    alignItems: "center",
    justifyContent: "center",
},
login: {
    fontWeight: "700",
    fontSize: 13,
},
email: {
    fontWeight: "400",
    fontSize: 11,
},
avatar: {
    width: 60,
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "#F6F6F6",
    zIndex: 999,
    marginRight: 8,
}, 
avatarPhoto: {
    width: 60, 
    height: 60,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
},
collectionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
},
postContainer: {
    marginBottom: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
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

export default DefaultScreenPosts;
