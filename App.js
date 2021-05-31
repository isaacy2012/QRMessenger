import * as React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {createStackNavigator} from '@react-navigation/stack';
import Home from "./Screens/Home";
import Scan from "./Screens/Scan";
import FullScreenQRCode from "./Screens/FullScreenQRCode";

export default function App() {

    //Navigation stack
    const Stack = createStackNavigator();
    const scheme = useColorScheme();
    return (
        <AppearanceProvider>
            <NavigationContainer
                theme={scheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <Stack.Navigator mode="modal">
                    <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
                    <Stack.Screen name="QR Code" component={FullScreenQRCode}/>
                    <Stack.Screen name="Scan" component={Scan}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    );
}


