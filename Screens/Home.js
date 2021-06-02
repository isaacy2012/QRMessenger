import * as React from 'react';
import {useState, useEffect} from 'react';
import {
    Text,
    Button,
    TextInput,
    View,
    SafeAreaView,
    TouchableHighlight,
    Alert, Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {BarCodeScanner} from 'expo-barcode-scanner';
import SvgQRCode from 'react-native-qrcode-svg';
import Clipboard from 'expo-clipboard';
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {useTheme} from "@react-navigation/native";
import * as SQLite from 'expo-sqlite';

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

    const db = SQLite.openDatabase('db.db');
    db.transaction(tx => {
        tx.executeSql(
            'create table if not exists items (id integer primary key not null, date text, value text);'
        );
    });

    /**
     * On route parameter update
     */
    useEffect(() => {
        if (route.params?.data) {
            // Set the recieveText to the data given to us from the "Scan" screen
            setReceiveText(route.params.data);
            db.transaction(tx => {
                console.log("trying...");
                tx.executeSql(
                    'insert into items (date, value) values (?,?)',[new Date().toDateString(), route.params.data]
                );
                tx.executeSql('select * from items', [], (_, { rows }) =>
                    console.log(JSON.stringify(rows))
                );
            });

        }
    }, [route.params?.data]);

    /**
     * Ask for Permissions
     */
    useEffect(() => {
        (async () => {
            if (Platform.OS.toLowerCase() === "web") {
                setHasPermission(true);
            } else {
                const {status} = await BarCodeScanner?.requestPermissionsAsync();
                setHasPermission(status === "granted");
            }
        })();
    }, []);

    /**
     * Get the QR Code Size
     * @param len the length of the string to encode
     * @returns {number}
     */
    function getQRCodeSize(len) {
        if (len < 10) {
            return 40 * Math.log(10);
        }
        return 40 * Math.log(len);
    }

    /**
     * Paste from clipboard
     */
    function pasteFromClipBoard() {
        let stringAsync = Clipboard.getStringAsync();
        stringAsync.then(str => setSendText(str));
    }

    return (
        <SafeAreaView style={styles(colors).app}>
            <KeyboardAwareScrollView style={styles(colors).scrollView}>
                <Text style={styles(colors).titleText}
                >QR Messenger</Text>
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
                                // if there is an error with the QR Code, its likely because there was
                                // too much data to store in the QR Code, so tell the user and reset
                                // the textInput
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
                        //Update the sendText
                        onChangeText={(text) => setSendText(text)}
                        value={sendText}
                    />
                    <View
                        style={sendText !== '' ? styles(colors).visible : styles(colors).invisible}
                    >
                        <Button
                            onPress={() => setSendText('')}
                            title="Clear"
                        />
                    </View>
                    <Button onPress={pasteFromClipBoard} title="Paste From Clipboard"/>
                </Card>
                <Card style={styles(colors).card}>
                    <Text style={styles(colors).heading}>Receive</Text>
                    <Text style={styles(colors).receiveText} selectable>{receiveText}</Text>
                    <Button
                        title="Scan"
                        // Navigate to the scan page
                        onPress={() => navigation.navigate('Scan')}
                    />
                </Card>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
