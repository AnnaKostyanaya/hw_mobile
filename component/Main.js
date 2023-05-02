import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { useRoute } from "../router";
import { app, auth } from "../firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { authStateChangeUser } from "../redux/auth/authOperations";

const Main = () => {
    const [user, setUser] = useState(null);

    const { stateChange } = useSelector((state) => state.auth);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(authStateChangeUser());
    }, [])

    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            const uid = user.uid; 
        }
    });

    const routing = useRoute(stateChange);
    useEffect(() => {}, []);
    return <NavigationContainer>{routing}</NavigationContainer>;
};

export default Main;