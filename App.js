import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Text,
    Button,
    TextInput,
    View,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Alert,
} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import SvgQRCode from 'react-native-qrcode-svg';
import Constants from 'expo-constants';
import Clipboard from 'expo-clipboard';
import {Card} from 'react-native-paper';
import {NavigationContainer, DefaultTheme, DarkTheme, useTheme} from '@react-navigation/native';
import {AppearanceProvider, useColorScheme} from 'react-native-appearance';
import {createStackNavigator, TransitionSpecs} from '@react-navigation/stack';
import {styles} from "./Styles";


function HomeScreen({navigation, route}) {
    const { colors } = useTheme();
    const [sendText, setSendText] = useState('');
    const [receiveText, setReceiveText] = useState('Nothing Received Yet');
    const [hasPermission, setHasPermission] = useState(true);

    React.useEffect(() => {
        if (route.params?.data) {
            // Post updated, do something with `route.params.post`
            // For example, send the post to the server
            setReceiveText(route.params.data);
        }
    }, [route.params?.data]);

    /**
     * Get the QR Code Size
     * @param len the length of the string to encode
     * @returns {number}
     */
    const getQRCodeSize = (len) => {
        if (len < 10) {
            return 40 * Math.log(10);
        }
        return 40 * Math.log(len);
    };


    /**
     * Ask for Permissions
     */
    useEffect(() => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const pasteFromClipBoard = () => {
        let stringAsync = Clipboard.getStringAsync();
        stringAsync.then(str => setSendText(str));
    }

    return (
        <SafeAreaView style={styles(colors).app}>
            <Text style={styles(colors).titleText}
            >QR Messenger</Text>
            <ScrollView style={styles(colors).scrollView}>
                <Card style={styles(colors).card}>
                    <Text style={styles(colors).heading}>Send</Text>
                    <View style={sendText !== '' ? styles(colors).qrcode : styles(colors).invisible}>
                        <SvgQRCode
                            value={sendText !== '' ? sendText : 'null'}
                            size={getQRCodeSize(sendText.length)}
                        />
                    </View>
                    <TextInput
                        multiline={false}
                        style={styles(colors).input}
                        placeholder={"Type message here"}
                        onChangeText={(text) => setSendText(text)}
                        value={sendText}
                    />
                    <Button onPress={pasteFromClipBoard} title="Paste From Clipboard"/>
                </Card>
                <Card style={styles(colors).card}>
                    <Text style={styles(colors).heading}>Recieve</Text>
                    <Text style={styles(colors).receiveText} selectable>{receiveText}</Text>
                    <Button
                        title="Scan"
                        onPress={() => navigation.navigate('Scan')}
                    />
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

function ScanScreen({navigation, route}) {
    const [scanned, setScanned] = useState(false);

    /**
     * When QRCode is scanned
     * @param data the data recieved
     */
    const onQRCodeScanned = ({data}) => {
        setScanned(true);
        //Tell user
        Alert.alert("Scan", `${data} copied to clipboard!`);
        //Copy to clipboard
        Clipboard.setString(String(data));
        //go back home
        navigation.navigate({
            name: 'Home',
            params: {data: data},
            merge: true,
        })
    };


    return (
        <SafeAreaView style={styles(colors).container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : onQRCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </SafeAreaView>
    );
}

export default function App() {


    const Stack = createStackNavigator();
    const scheme = useColorScheme();
    return (
        <AppearanceProvider>
            <NavigationContainer
                theme={scheme === "dark" ? DarkTheme : DefaultTheme}
            >
                <Stack.Navigator mode="modal">
                    <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}}/>
                    <Stack.Screen name="Scan" component={ScanScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </AppearanceProvider>
    );
}


