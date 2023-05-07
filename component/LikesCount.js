import { useState, useEffect } from "react";
import { Text, StyleSheet, View} from "react-native";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { AntDesign } from '@expo/vector-icons';
import IconWithStroke from "../component/IconWithStroke";

export default function LikesCount({ postId }) {
    const [likesCount, setLikesCount] = useState(0);
    const [userLiked, setUserLiked] = useState(false);
    const { userId } = useSelector((store) => store.auth);

    useEffect(() => {
        const unsubscribe = onSnapshot(
        collection(db, "posts", postId, "likes"),
        (snapshot) => {
            let likesCount = snapshot.size;
            let userLiked = false;
            snapshot.forEach((doc) => {
                if (doc.data().userId === userId) {
                userLiked = true;
                }
            });
            setLikesCount(likesCount);
            setUserLiked(userLiked);
        }
        );
        return () => unsubscribe();
    }, [postId]);

    return (
        <>
            {userLiked ? (
                <IconWithStroke size={22}/>
            ) : (
            <AntDesign name="like2" size={18} color="#BDBDBD" />
            )}
            <Text style={styles.iconText}>{likesCount !== null ? String(likesCount) : "Loading..."}</Text>
        </>
    );
    }

    const styles = StyleSheet.create({
    iconText: {
        marginLeft: 10,
    },
});

