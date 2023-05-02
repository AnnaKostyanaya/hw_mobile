import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { db } from "../../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";


const DefaultScreenPosts = ({ route, navigation }) => {

    const [posts, setPosts] = useState([]);

    const getAllPosts = async () => {
        onSnapshot(collection(db, "posts"), (snapshot) => {
            const posts = [];
            snapshot.forEach((doc) => {
                posts.push({ ...doc.data(), id: doc.id });
            });
            setPosts(posts);
            });
        };

    useEffect(() => {
        getAllPosts();
        // console.log(posts);
    }, []);

    return (
        <View style={styles.container}>
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
                            <TouchableOpacity onPress={() => navigation.navigate("CommentsScreen", {postId: item.id, postPhoto: item.photo})}> 
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
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 32,
    },
postContainer: {
    marginBottom: 10,
    marginTop: 32,
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

export default DefaultScreenPosts;
