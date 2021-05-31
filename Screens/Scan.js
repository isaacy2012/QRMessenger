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

/**
 * Scan
 * @param navigation
 * @param route
 * @returns {JSX.Element}
 * @constructor
 */
export default function Scan({navigation, route}) {
    const { colors } = useTheme();
    const [scanned, setScanned] = useState(false);

    /**
     * When QRCode is scanned
     * @param data the data recieved
     */
    const onQRCodeScanned = ({data}) => {
        setScanned(true);
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
