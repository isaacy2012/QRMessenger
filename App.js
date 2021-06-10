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
import {Platform} from "react-native-web";

/**
 * Application Entry Point
 * @returns {JSX.Element}
 * @constructor
 */
export default function App() {

    // Stack Navigation
    const Stack = createStackNavigator();
    // Tabbed Navigation
    const Tab = createBottomTabNavigator();

    const colorScheme = useColorScheme();

    /**
     * Get the icon name, wrt the focus and current platform
     * @param str the base icon name e.g "list"
     * @param focused whether the icon should be in focus or not
     * @returns {string} the final icon name
     */
    function getIconName(str, focused) {
        if (Platform.OS === "ios") { //ios
            let ret = "ios-" + str;
            if (focused) {
                return ret;
            } else {
                return ret + "-outline";
            }
        } else { //Android
            return "md-" + str;
        }
    }

    /**
     * The home stack.
     * Home:
     *  QR Code
     *  Scan
     * @returns {JSX.Element}
     * @constructor
     */
    function HomeStack() {
        return (
            <Stack.Navigator mode="modal">
                <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
                <Stack.Screen name="QR Code" component={FullScreenQRCode}/>
                <Stack.Screen name="Scan" component={Scan}/>
            </Stack.Navigator>
        );
    }

    /**
     * The history stack.
     * History:
     *  QR Code
     * @returns {JSX.Element}
     * @constructor
     */
    function HistoryStack() {
        return (
            <Stack.Navigator mode="modal">
                <Stack.Screen name="History" component={History} options={{headerShown: false}}/>
                <Stack.Screen name="QR Code" component={FullScreenQRCode}/>
            </Stack.Navigator>
        );
    }

    return (
        <AppearanceProvider>
            <NavigationContainer
                theme={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <Tab.Navigator
                    screenOptions={({route}) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let iconName;
                            if (route.name === "Home") {
                                iconName = getIconName("scan", focused);
                            } else if (route.name === "History") {
                                iconName = getIconName("list", focused);
                            }
                            return <Ionicons name={iconName} size={size} color={color}/>;
                        },
                    })}
                >
                    <Tab.Screen name="Home" component={HomeStack}/>
                    <Tab.Screen name="History" component={HistoryStack}/>
                </Tab.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    );
}


