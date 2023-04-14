import React from "react";
import { StyleSheet } from "react-native";
import PostsScreen from "./PostsScreen";


const Home = ({ navigation }) => {
    return (
        <PostsScreen />
    );
};

const styles = StyleSheet.create({
    container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
},
});

export default Home;