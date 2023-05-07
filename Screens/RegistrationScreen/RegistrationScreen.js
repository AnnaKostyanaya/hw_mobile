import React, { useState} from "react";
import {
StyleSheet,
TextInput,
Image,
View,
Text,
KeyboardAvoidingView,
ImageBackground,
TouchableOpacity,
Platform,
Keyboard,
TouchableWithoutFeedback
} from "react-native";
import { authSignUpUser } from "../../redux/auth/authOperations";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { storage, app, db } from "../../firebase/config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { SvgXml } from 'react-native-svg';

const xmlAdd = `
    <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g transform="rotate(45, 18.5, 18.5)">
            <circle cx="18.4999" cy="18.5" r="12" fill="white" stroke="#E8E8E8"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2574 13.5503L13.5503 14.2574L17.7929 18.5L13.5503 22.7426L14.2574 23.4497L18.5 19.2071L22.7426 23.4497L23.4498 22.7426L19.2071 18.5L23.4498 14.2574L22.7426 13.5503L18.5 17.7929L14.2574 13.5503Z" fill="red"/>
        </g>
    </svg>
`;

const initialState = {
    login: "",
    email: "",
    password: "",
    photoURL: "",
}

const RegistrationScreen = ({ navigation }) => {

    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [state, setState] = useState(initialState);
    
    const dispatch = useDispatch();

    const handleSubmit = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();

        dispatch(authSignUpUser(state));
        setState(initialState);
    }
    const keyboardHide = () => {
        Keyboard.dismiss();
        setIsShowKeyboard(false);
    };

    const selectImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            });
        
            if (result) {
                const photoURL = await uploadPhotoToServer(result.assets[0].uri);
                setState(prevState => ({...prevState, photoURL: photoURL}));
            }
            };
    
    const uploadPhotoToServer = async (image) => {
        try {
            const response = await fetch(image);
            const file = await response.blob();
            const uniqueUserId = Date.now().toString();
            const storage = getStorage(app);
            const storageRef = ref(storage, `userImage/${uniqueUserId}`);
            await uploadBytes(storageRef, file);
        
            const photoURL = await getDownloadURL(storageRef);
            return photoURL;
            } catch (error) {
            console.log(error);
            }
        };

return (
<ImageBackground
    style={styles.image}
    source={require('../../assets/BG.png')}
>
    <TouchableWithoutFeedback onPress={keyboardHide}>
        <View style={styles.containerForm}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <View style={styles.avatar}>
                    {state.photoURL && <Image source={{ uri: state.photoURL }} style={{ width: 120, height: 120 }} />}
                    <TouchableOpacity style={styles.addIconContainer} onPress={selectImage}>
                        <SvgXml xml={xmlAdd} />
                        {/* <Image style={styles.addIcon} source={require('../../assets/add.png')}></Image> */}
                    </TouchableOpacity>
                </View>
                <View style={{ ...styles.form, marginBottom: isShowKeyboard ? 32 : 0 }}>
                <Text style={styles.textReg}>Реєстрація</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Логін"
                    placeholderTextColor={"#BDBDBD"}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.login}
                    onChangeText={(value) => setState((prevState) => ({...prevState, login: value}))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Адреса електронної пошти"
                    placeholderTextColor={"#BDBDBD"}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.email}
                    onChangeText={(value) => setState((prevState) => ({...prevState, email: value}))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    secureTextEntry={true}
                    placeholderTextColor={"#BDBDBD"}
                    onFocus={() => setIsShowKeyboard(true)}
                    value={state.password}
                    onChangeText={(value) => setState((prevState) => ({...prevState, password: value}))}
                />
                </View>
            </KeyboardAvoidingView>


            <View style={styles.registerCont}>
                <TouchableOpacity
                style={styles.btnReg}
                activeOpacity={0.8}
                onPress={handleSubmit}
                >
                <Text style={styles.textBtn}>Зареєструватися</Text>
                </TouchableOpacity>
                <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => navigation.navigate("Login")}
                >
                <Text style={styles.textLog}>Вже є аккаунт? Увійти</Text>
                </TouchableOpacity>
            </View>
            
        </View>
    </TouchableWithoutFeedback>
</ImageBackground>
);
};

const styles = StyleSheet.create({
containerForm: {
backgroundColor: "#fff",
borderTopLeftRadius: 25,
borderTopRightRadius: 25,
},
image: {
flex: 1,
resizeMode: "cover",
justifyContent: "flex-end",
},
form: {
marginHorizontal: 16,
},
avatar: {
    width: 120,
    height: 120,
    position: "absolute",
    top: -60,
    left: "50%",
    transform: [{ translateX: parseInt("-50%") }],
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: "#F6F6F6",
    zIndex: 999,
}, 
addIconContainer: {
    position: 'absolute',
    top: 70,
    right: -18,
    zIndex: 999,
},
addIcon: {
    width: 25,
    height: 25,
},  
input: {
borderWidth: 1,
height: 50,
borderColor: "#E8E8E8",
backgroundColor: "#F6F6F6",
color: "#212121",
borderRadius: 8,
padding: 16,
marginBottom: 16,
},
textReg: {
color: "#212121",
fontSize: 30,
textAlign: "center",
fontWeight: "500",
marginTop: 92,
marginBottom: 32,
},
registerCont: {
marginHorizontal: 16,
marginBottom: 78,
},
btnReg: {
backgroundColor: "#FF6C00",
padding: 16,
borderRadius: 100,
alignItems: "center",
marginTop: 27,
marginBottom: 16,
},
textBtn: {
color: "#fff",
fontWeight: "400",
fontSize: 16,
},
textLog: {
color: "#1B4371",
textAlign: "center",
fontWeight: "400",
fontSize: 16,
},
});

export default RegistrationScreen;

