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
import { useDispatch } from "react-redux";

const initialState = {
    login: "",
    email: "",
    password: "",
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
                    <TouchableOpacity style={styles.addIconContainer}>
                        <Image style={styles.addIcon} source={require('../../assets/add.png')}></Image>
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
    backgroundColor: "#F6F6F6",
    zIndex: 999,
}, 
addIconContainer: {
    position: 'absolute',
    top: 80,
    right: -12,
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

