import * as React from 'react';
import {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Alert,
} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import Clipboard from 'expo-clipboard';
import {useTheme} from '@react-navigation/native';
import {styles} from "../Styles";
import * as SQLite from "expo-sqlite";

/**
 * Scan Screen
 * @param navigation
 * @param route
 * @returns {JSX.Element} Scan Screen
 * @constructor
 */
export default function Scan({navigation, route}) {
    const {colors} = useTheme();
    const [scanned, setScanned] = useState(false);


    const db = SQLite.openDatabase('db.db');
    db.transaction(tx => {
        tx.executeSql(
            'create table if not exists items (id integer primary key not null, date text, value text);'
        );
    });

    /**
     * When QRCode is scanned
     * @param data the data recieved
     */
    function onQRCodeScanned({data}) {
        setScanned(true);
        db.transaction(tx => {
            console.log("trying...");
            tx.executeSql(
                'insert into items (date, value) values (?,?)',[new Date().toDateString(), data]
            );
            tx.executeSql('select * from items', [], (_, { rows }) =>
                console.log(JSON.stringify(rows))
            );
        });

        //Tell user
        Alert.alert("Scan", 'Contents copied to clipboard!');
        //Copy to clipboard
        Clipboard.setString(String(data));
        //go back home
        navigation.navigate({
            name: 'Home',
            params: {data: data},
            merge: true,
        })
    }


    return (
        <SafeAreaView style={styles(colors).container}>
            <BarCodeScanner
                onBarCodeScanned={scanned ? undefined : onQRCodeScanned}
                style={StyleSheet.absoluteFillObject}
            />
        </SafeAreaView>
    );
}
