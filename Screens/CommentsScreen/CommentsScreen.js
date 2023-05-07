import React, { useState, useEffect } from "react";
import { View, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, FlatList, Text, Image } from "react-native";
import Svg, { Path } from "react-native-svg";
import { useSelector } from "react-redux";
import { db } from "../../firebase/config";
import { collection, addDoc, onSnapshot, serverTimestamp, query, where, doc } from "firebase/firestore"; 
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';


const CommentsScreen = ({ route }) => {
    const { postId } = route.params;
    const { postPhoto } = route.params;
    const [comment, setComment] = useState("");                                                                                 
    const [allComments, setAllComments] = useState([]);
    const { login, userId, photoURL } = useSelector((state) => state.auth); 
    const [lastSenderId, setLastSenderId] = useState(null);

    useEffect(() => {
        getAllComment();
        console.log(login);
    }, []);

    const sendComment = async () => {
        if (comment) {
            try {
                const commentsRef = collection(db, "posts", postId, "comments");
                const newCommentRef = await addDoc(commentsRef, { comment, login, userId, data: moment().format('D MMMM YYYY | HH.mm') });
                setComment("");
            } catch (error) {
                console.error(error);
            }
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

        const handleNewMessage = (message) => {
            setMessages([...messages, message]);
            if (message.senderId !== lastSenderId) {
                setLastSenderId(message.senderId);
            }
        };


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
        renderItem={({ item, index }) => (
            <View style={[styles.allCommentsContainer, index % 2 === 0 ? styles.leftComment : styles.rightComment]}>
                {photoURL ? (
                    <View style={styles.avatar}>
                    <Image style={styles.avatarPhoto} source={{ uri: photoURL }} />
                    </View>
                ) : (
                    <View style={styles.avatar}>
                    <Ionicons name="md-person-circle-outline" size={28} color="#BDBDBD" />
                    </View>
                )}
                <View style={styles.textContainer}>
                    <Text style={styles.comment}>{item.comment}</Text>
                    <Text style={[styles.data, index % 2 === 0 ? styles.leftText : styles.rightText]}>{item.data}</Text>
                </View>
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
    alignItems: "flex-start", 
    justifyContent: "flex-end",
    marginRight: 16,
    marginLeft: 16,
},
rightComment: {
    flexDirection: "row-reverse"
},
leftComment: {
    flexDirection: 'row', 
},
textContainer: {
    flex: 1,
    width: 299,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    borderRadius: 6,
    padding: 16,
    marginBottom: 40,
},
comment: {
    color: "#212121",
    fontSize: 13,
},
data: {
    color: "#BDBDBD",
    fontSize: 12,
    marginTop: 8,
},
leftText: {
    marginLeft: 'auto'
},
rightText: {
    marginRight: 'auto'
},
avatar: {
    width: 28,
    height: 28,
    marginRight: 16,
    marginLeft: 16,
    borderRadius: 50,
    zIndex: 999,
}, 
avatarPhoto: {
    width: 28, 
    height: 28,
    borderRadius: 50,
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