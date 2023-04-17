import React, {useState, useEffect} from "react";
import { View, Text, StyleSheet, FlatList, Image, Button } from "react-native";


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
            </View>
            )}
        />
        <Button title="go to map" onPress={() => navigation.navigate("MapScreen")} />
        <Button
            title="go to Comments"
            onPress={() => navigation.navigate("CommentsScreen")}
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
