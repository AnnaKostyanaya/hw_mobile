
import React from "react";
import { moduleName } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import DefaultScreenPosts from "../DefaultScreenPosts/DefaultScreenPosts";
import CommentsScreen from "../CommentsScreen/CommentsScreen";
import MapScreen from "../MapScreen/MapScreen";

const NestedScreen = createStackNavigator();

const PostsScreen = () => {
    return (
        <NestedScreen.Navigator >
            <NestedScreen.Screen
                name="DefaultScreenPosts"
                component={DefaultScreenPosts}
                options={{ headerShown: false }}
            />
            <NestedScreen.Screen name="CommentsScreen" component={CommentsScreen} options={{ headerShown: false }} />
            <NestedScreen.Screen name="MapScreen" component={MapScreen} options={{ headerShown: false }} />
        </NestedScreen.Navigator>
    );
};

export default PostsScreen;