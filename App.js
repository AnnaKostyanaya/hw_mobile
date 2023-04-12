import React, {useState} from "react";
import RegistrationScreen from './Screens/RegistrationScreen/RegistrationScreen';
import {
  View,
} from "react-native";
// import LoginScreen from './Screens/LoginScreen/LoginScreen';

import * as Font from "expo-font";
import { AppLoading } from "expo";

const loadApplication = async () => {
  await Font.loadAsync({
    "Roboto-Bold": require("./Screens/img/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./Screens/img/Roboto-Regular.ttf"),
  });
};

export default function App() {
  // const [iasReady, setIasReady] = useState(false);

  // if (!iasReady) {
  //   return (
  //     <AppLoading
  //       startAsync={loadApplication}
  //       onFinish={() => setIasReady(true)}
  //     />
  //   );
  // }

  
  return (
    <>
      <RegistrationScreen/>
      {/* <LoginScreen/> */}
    </>
  );
}

