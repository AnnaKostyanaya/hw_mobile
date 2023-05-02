import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Text, Image } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, addDoc, onSnapshot, serverTimestamp, query, where, doc } from "firebase/firestore"; 
import moment from 'moment';


const CommentsScreen = ({ route }) => {
    const { postId } = route.params;
    const { postPhoto } = route.params;
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const { login } = useSelector((state) => state.auth);

    useEffect(() => {
        getAllComment();
        console.log(login);
    }, []);

    const sendComment = async () => {
        try {
            const commentsRef = collection(db, "posts", postId, "comments");
            const newCommentRef = await addDoc(commentsRef, { comment, login, data: moment().format('D MMMM YYYY | HH.mm') });
            console.log(comment)
            setComment("");
            console.log(comment)
        } catch (error) {
            console.error(error);
        }
    };

    const getAllComment = async () => {
        onSnapshot(collection(db, "posts", postId, "comments"), (snapshot) => {
            const comments = [];
            snapshot.forEach((doc) => {
                comments.push({ ...doc.data(), id: doc.id });
            });
            setAllComments(comments);
            });
        };

    // const getPost = (postId) => {
    //     const postDocRef = doc(db, "posts", `postId`);
    //     onSnapshot(postDocRef, (doc) => {
    //         if (doc.exists()) {
    //         const post = { ...doc.data(), id: doc.id };
    //         setPost(post);
    //         } else {
    //         console.log("No such document!");
    //         }
    //     });
    // }

return (
<View style={styles.container}>
    <View style={styles.pictureContainer}>
        <Image
        source={{ uri: postPhoto }}
        style={styles.imageContainer}
        />
    </View>
    <SafeAreaView style={styles.commentArea}>
        <FlatList
        data={allComments}
        renderItem={({ item }) => (
            <View style={styles.allCommentsContainer}>
                <Text>{item.login}</Text>
                <Text>{item.comment}</Text>
                <Text>{item.data}</Text>
            </View>
        )}
        keyExtractor={(item) => item.id}
        />
    </SafeAreaView>
    <View style={styles.commentContainer}>
        <View style={styles.fieldComment}>
            <TextInput
                style={styles.input}
                placeholder="Коментувати..."
                placeholderTextColor={"#BDBDBD"}
                value={comment}
                onChangeText={setComment}
            />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={sendComment}>
            <Svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path d="M6 1L6.35355 0.646447C6.15829 0.451184 5.84171 0.451184 5.64645 0.646447L6 1ZM10.6464 6.35355C10.8417 6.54882 11.1583 6.54882 11.3536 6.35355C11.5488 6.15829 11.5488 5.84171 11.3536 5.64645L10.6464 6.35355ZM0.646447 5.64645C0.451184 5.84171 0.451184 6.15829 0.646447 6.35355C0.841709 6.54882 1.15829 6.54882 1.35355 6.35355L0.646447 5.64645ZM5.5 15C5.5 15.2761 5.72386 15.5 6 15.5C6.27614 15.5 6.5 15.2761 6.5 15H5.5ZM5.64645 1.35355L10.6464 6.35355L11.3536 5.64645L6.35355 0.646447L5.64645 1.35355ZM5.64645 0.646447L0.646447 5.64645L1.35355 6.35355L6.35355 1.35355L5.64645 0.646447ZM5.5 1V8H6.5V1H5.5ZM5.5 8V15H6.5V8H5.5Z" fill="white"/>
            </Svg>
        </TouchableOpacity>
    </View>
</View>
);
};

const styles = StyleSheet.create({
container: {
    flex: 1, 
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingLeft: 16,
    paddingRight: 16,
},
pictureContainer: {
    alignItems: 'center',
},
imageContainer: {
    width: 343, 
    height: 240, 
    borderRadius: 8, 
    marginTop: 32,
    marginBottom: 32,
},
commentArea: {
    flex: 1,
}, 
allCommentsContainer: {
    width: 299,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    marginHorizontal: 10,
    padding: 10,
    marginBottom: 10,
},
commentContainer: {
    flexDirection: 'row', 
    alignItems: 'center',  
    marginTop: 11,  
    justifyContent: "space-between",
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    width: 343,
    height: 50,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 100,
    },
fieldComment: {
    padding: 16,
    fontSize: 16,
    fontWeight: "500",
},
sendBtn: {
    width: 34,
    height: 34,
    backgroundColor: "#FF6C00",
    padding: 10,
    borderRadius: 50,
    alignItems: "center",
    margin: 8,
    },
});

export default CommentsScreen;