import { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import { db } from "../firebase/config";
import { collection, getDocs, onSnapshot  } from "firebase/firestore";
import { Feather } from '@expo/vector-icons';
import { useSelector } from "react-redux";
import Svg, { Path } from "react-native-svg";

export default function CommentCount({ postId }) {
    const [commentCount, setCommentsCount] = useState(null);
    const [userCommented, setUserCommented] = useState(null);
    const { userId } = useSelector((store) => store.auth);

useEffect(() => {
    const unsubscribe = onSnapshot(
    collection(db, "posts", postId, "comments"),
    (snapshot) => {
        let commentCount = snapshot.size;
        let userComment = false;
        snapshot.forEach((doc) => {
            if (doc.data().userId === userId) {
                userComment = true;
            }
        });
        setUserCommented(userComment);
        setCommentsCount(commentCount);
    }
    );
    return () => unsubscribe();
}, [postId]);

    return (
        <>
        {userCommented ? (
            <Svg width="18" height="18" viewBox="0 0 20 20" fill="#FF6C00" stroke="#FF6C00" xmlns="http://www.w3.org/2000/svg">
                <Path fill="#FF6C00" stroke="#FF6C00" fill-rule="evenodd" clip-rule="evenodd" d="M1 9.5C0.996559 10.8199 1.30493 12.1219 1.9 13.3C3.33904 16.1793 6.28109 17.9988 9.5 18C10.8199 18.0034 12.1219 17.6951 13.3 17.1L19 19L17.1 13.3C17.6951 12.1219 18.0034 10.8199 18 9.5C17.9988 6.28109 16.1793 3.33904 13.3 1.9C12.1219 1.30493 10.8199 0.996557 9.5 0.999998H9C4.68419 1.2381 1.2381 4.68419 1 9V9.5V9.5Z" stroke-linecap="round" stroke-linejoin="round"/>
            </Svg>   
        ) : (
            <Feather name="message-circle" size={18} color="#BDBDBD" />
        )}
        <Text style={styles.iconText}>
        {commentCount !== null ? String(commentCount) : "Loading..."}
        </Text>
    </>     
    );

}

const styles = StyleSheet.create({
    iconText: {
        marginLeft: 10, 
    },
})