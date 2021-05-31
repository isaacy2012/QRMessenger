import * as React from 'react';
import {NavigationContainer, DefaultTheme, DarkTheme} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';

import Home from "./Screens/Home";
import Scan from "./Screens/Scan";
import History from "./Screens/History";
import FullScreenQRCode from "./Screens/FullScreenQRCode";



export default function App() {

    //Navigation stack
    const Stack = createStackNavigator();
    const Tab = createBottomTabNavigator();

    const scheme = useColorScheme();

    function getIconName(str, focused) {
        if (Platform.OS === "ios") {
            let ret = "ios-" + str;
            if (focused) {
                return ret;
            } else {
                return ret + "-outline";
            }


        } else {
            return "md-" + str;
        }
    }

    function HomeStack() {

        return (
                <Stack.Navigator mode="modal">
                    <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
                    <Stack.Screen name="QR Code" component={FullScreenQRCode}/>
                    <Stack.Screen name="Scan" component={Scan}/>
                </Stack.Navigator>
        );
    }
    return (
        <AppearanceProvider>
            <NavigationContainer
                theme={scheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === "Home") {
                                iconName = getIconName("scan", focused);
                            } else if (route.name === "History") {
                                iconName = getIconName("list", focused);
                            }

                            // You can return any component that you like here!
                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                    })}
                >
                    <Tab.Screen name="Home" component={HomeStack}/>
                    <Tab.Screen name="History" component={History}/>
                </Tab.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    );
}


