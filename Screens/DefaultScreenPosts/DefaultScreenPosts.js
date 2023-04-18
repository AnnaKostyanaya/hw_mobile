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
                    style={{
                    marginBottom: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    }}
                >
                    <Image
                    source={{ uri: item.photo }}
                    style={{ width: 343, height: 240, borderRadius: 8, }}
                    />
                    <View  style={{ marginTop: 8, width: "100%", marginLeft: 8, marginRight: 8, justifyContent: "space-evenly"}}>
                        <Text title="Name" style={{ fontSize: 16,  fontWeight: 'bold'}}>Name</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center',  marginTop: 11,  justifyContent: 'space-between'}}>
                            <TouchableOpacity onPress={() => navigation.navigate("CommentsScreen")}> 
                                <Feather name="message-circle" size={18} color="#BDBDBD" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("MapScreen")} style={{flexDirection: 'row', alignItems: 'center'}} > 
                                <Feather name="map-pin" size={18} color="#BDBDBD" style={{marginRight: 6}}/>
                                <Text style={{ fontSize: 16, marginLeft: 7, textDecorationLine: 'underline' }} >Location</Text>
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
});

export default DefaultScreenPosts;
