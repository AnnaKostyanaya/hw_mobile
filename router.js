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
import { TouchableOpacity, View } from "react-native";

import { authSignOutUser } from "./redux/auth/authOperations";
import { useDispatch } from "react-redux";



const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

export const useRoute = (isAuth) => {
    const dispatch = useDispatch();
    const signOut = () => {
        dispatch(authSignOutUser());
    };
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
            tabBarShowLabel: false,
            tabBarStyle: [
                {
                    display: "flex",
                    height: 83,
                    paddingTop: 9,
                    paddingBottom: 34,
                    },
                    null,
                ],
        }} 
        >
        <MainTab.Screen  options={() => ({
            tabBarIcon: ({ focused, size, color }) => (
                <Feather name="grid" size={size} color="#212121" />
            ),
            headerRight: ({ focused, size, color }) => (
                <TouchableOpacity onPress={signOut}>
                    <AntDesign name="logout" size={24} color="#BDBDBD" />
                </TouchableOpacity>
                ),
                headerTitle: "Публікації",
                headerTitleAlign: "center",
                headerRightContainerStyle: {
                    paddingRight: 10,
                },
        })} name="PostsScreen" component={PostsScreen} />
        <MainTab.Screen 
            options={{
                tabBarStyle: { display: 'none' },
                tabBarIcon: ({ focused, size, color }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 70,
                            height: 40,
                            borderRadius: 20,
                            backgroundColor: "#FF6C00",
                        }}
                        >
                        <Feather name="plus" size={size} color={"#FFFFFF"} />
                    </View>
                ),
                headerRight: ({ focused, size, color }) => (
                <TouchableOpacity>
                </TouchableOpacity>
                ),
                headerTitle: "Створити публікацію",
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
                headerTitle: "",
            }}
        name="ProfileScreen" component={ProfileScreen} />
        </MainTab.Navigator>
    );
};
