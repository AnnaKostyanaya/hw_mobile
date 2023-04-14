import React, {useState} from "react";
import {
  View,
} from "react-native";


import * as Font from "expo-font";
import { AppLoading } from "expo";
import { NavigationContainer } from "@react-navigation/native";

import { useRoute } from "./router";

const loadApplication = async () => {
  await Font.loadAsync({
    "Roboto-Bold": require("./Screens/img/Roboto-Bold.ttf"),
    "Roboto-Regular": require("./Screens/img/Roboto-Regular.ttf"),
  });
};


export default function App() {
  // const [iasReady, setIasReady] = useState(false);
  const routing = useRoute(true);

  // if (!iasReady) {
  //   return (
  //     <AppLoading
  //       startAsync={loadApplication}
  //       onFinish={() => setIasReady(true)}
  //           onError={console.warn}
  //     />
  //   );
  // }

  
return (
  <NavigationContainer>
    {routing}
  </NavigationContainer>
  );
}
