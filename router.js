import React from "react";
import { Feather } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons'; 

import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import RegistrationScreen from './Screens/RegistrationScreen/RegistrationScreen';
import LoginScreen from './Screens/LoginScreen/LoginScreen';
import PostsScreen from './Screens/PostsScreen/PostsScreen';
import CreatePostsScreen from './Screens/CreatePostsScreen/CreatePostsScreen';
import ProfileScreen from './Screens/ProfileScreen/ProfileScreen';
import { TouchableOpacity } from "react-native";


const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
    if (!isAuth) {
        return (
        <AuthStack.Navigator 
        screenOptions={{
                "tabBarShowLabel": false,
                "tabBarStyle": [
                {
                    "display": "flex"
                },
                null
                ]
            }}
        // tabBarOptions={{showLabel: false}}
        >
            <AuthStack.Screen
            name="Login"
            component={LoginScreen}
            />
            <AuthStack.Screen
            name="Register"
            component={RegistrationScreen}
            />
        </AuthStack.Navigator>
        );
    }
    return (
        <MainTab.Navigator
        screenOptions={{
            "tabBarShowLabel": false,
            "tabBarStyle": [
            {
                "display": "flex"
            },
            null
            ]
        }} 
        // tabBarOptions={{showLabel: false}}
        >
        <MainTab.Screen  options={() => ({
            tabBarIcon: ({ focused, size, color }) => (
                <Feather name="grid" size={size} color="#212121" />
            ),
            headerRight: ({ focused, size, color }) => (
                <TouchableOpacity>
                    <AntDesign name="logout" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                ),
                headerTitle: "Posts",
                headerTitleAlign: "center",
                headerRightContainerStyle: {
                    paddingRight: 10,
                },
        })} name="PostsScreen" component={PostsScreen} />
        <MainTab.Screen  options={{
            tabBarIcon: ({ focused, size, color }) => (
                <Feather name="plus" size={size} color={color} />
            ),
            headerRight: ({ focused, size, color }) => (
                <TouchableOpacity>
                </TouchableOpacity>
                ),
                headerTitle: "Create Post",
                headerTitleAlign: "center",
                headerRightContainerStyle: {
                    paddingRight: 10,
                },
        }}
        name="CreatePostsScreen" component={CreatePostsScreen} />
        <MainTab.Screen  options={{
            tabBarIcon: ({ focused, size, color }) => (
                <Feather name="user" size={size} color={color} />
            ),
            headerRight: ({ focused, size, color }) => (
                <TouchableOpacity>
                </TouchableOpacity>
                ),
                headerTitle: "Profile Screen",
                headerTitleAlign: "center",
                headerRightContainerStyle: {
                    paddingRight: 10,
                },
            }}
        name="ProfileScreen" component={ProfileScreen} />
        </MainTab.Navigator>
    );
};
