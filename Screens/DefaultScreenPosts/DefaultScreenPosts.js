import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';

const DefaultScreenPosts = ({ route, navigation }) => {

    const [posts, setPosts] = useState([]);
    console.log("route.params", route.params);

    useEffect(() => {
        if (route.params) {
        setPosts((prevState) => [...prevState, route.params]);
        }
    }, [route.params]);
    console.log("posts", posts);

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
                        <Text title="Name" style={styles.textName}>Name</Text>
                        <View style={styles.iconContainer}>
                            <TouchableOpacity onPress={() => navigation.navigate("CommentsScreen")}> 
                                <Feather name="message-circle" size={18} color="#BDBDBD" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("MapScreen")} style={styles.locationContainer}> 
                                <Feather name="map-pin" size={18} color="#BDBDBD" style={{marginRight: 6}}/>
                                <Text style={styles.locationName}>Location</Text>
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
