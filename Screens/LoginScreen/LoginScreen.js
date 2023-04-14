import React, { useState} from "react";
import {
StyleSheet,
TextInput,
View,
Text,
TouchableOpacity,
KeyboardAvoidingView,
Platform,
Keyboard,
ImageBackground,
TouchableWithoutFeedback
} from "react-native";

const initialState = {
    email: "",
    password: "",
}
const LoginScreen = ({ navigation }) => {

    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [state, setState] = useState(initialState);

    const keyBoardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    console.log(state);
}


return (
<ImageBackground
    style={styles.image}
    source={require("../../assets/BG.png")}
>
    <TouchableWithoutFeedback onPress={() => {keyBoardHide()}}>
        <View style={styles.containerForm}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardShouldPersistTaps={false}
            >
                <View
                style={{ ...styles.form, marginBottom: isShowKeyboard ? 32 : 0 }}
                >
                <Text style={styles.textReg}>Увійти</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Адреса елктронної пошти"
                    placeholderTextColor={"#BDBDBD"}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={(value) => setState((prevState) => ({...prevState, email: value}))}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Пароль"
                    secureTextEntry={true}
                    placeholderTextColor={"#BDBDBD"}
                    onFocus={() => setIsShowKeyboard(true)}
                    onChangeText={(value) => setState((prevState) => ({...prevState, password: value}))}
                />
                </View>
            </KeyboardAvoidingView>

                <View style={styles.registerCont}>
                <TouchableOpacity
                    style={styles.btnReg}
                    activeOpacity={0.8}
                    onPress={() => {keyBoardHide()}}
                >
                    <Text style={styles.textBtn}>Увійти</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate("Register")}
                >
                    <Text style={styles.textLog} >
                    Немає аккаунта? Зареєструватися
                    </Text>
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
marginTop: 32,
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

export default LoginScreen;