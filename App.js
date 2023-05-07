import React, {useState} from "react";
import { View } from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { Provider, useSelector } from "react-redux";
import { store } from "./redux/store";
import { useRoute } from "./router";
import Main from "./component/Main";

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
  //           onError={console.warn}
  //     />
  //   );
  // }

  
return (
  <Provider store = {store}>
    <Main />
  </Provider>
  );
}

