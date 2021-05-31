import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Text,
    Button,
    TextInput,
    View,
    SafeAreaView,
    ScrollView, TouchableHighlight, Alert,
} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import SvgQRCode from 'react-native-qrcode-svg';
import Clipboard from 'expo-clipboard';
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {useTheme} from "@react-navigation/native";

/**
 * ScreenHome
 * @param navigation
 * @param route
 * @returns {JSX.Element}
 * @constructor
 */
export default function Home({navigation, route}) {
    const {colors} = useTheme();

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
                    <View
                        style={sendText !== '' ? styles(colors).qrcode : styles(colors).invisible}
                    >
                        <TouchableHighlight
                            onPress={() => navigation.navigate({
                                name: 'QR Code',
                                params: {data: sendText},
                                merge: true,
                            })}
                        >
                            <SvgQRCode
                                value={sendText !== '' ? sendText : 'null'}
                                onError={() => {
                                    setSendText('')
                                    Alert.alert("QR Code Error", "Too much data to store into a QR Code");
                                }}
                                size={getQRCodeSize(sendText.length)}
                            />
                        </TouchableHighlight>
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
