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
import SvgQRCode from "react-native-qrcode-svg";
import { Dimensions } from 'react-native';

/**
 * Fullscreen QR Code Screen
 * @param navigation
 * @param route
 * @returns {JSX.Element} Fullscreen QR Code Screen
 * @constructor
 */
export default function FullScreenQRCode({navigation, route}) {
    const { colors } = useTheme();

    const [data, setData] = useState('');

    React.useEffect(() => {
        if (route.params?.data) {
            // Set the data of this QR Code to the data given to us from the "Home" screen
            setData(route.params.data);
        }
    }, [route.params?.data]);

    //set the size of the QR Code to be as big as possible
    let size = Math.min(Dimensions.get('window').width, Dimensions.get('window').height);

    return (
        <SafeAreaView style={styles(colors).container}>
            <SvgQRCode
                value={data !== '' ? data : 'null'}
                size = {size}
            />
        </SafeAreaView>
    );
}
