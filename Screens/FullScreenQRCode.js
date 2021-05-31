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
 * Scan
 * @param navigation
 * @param route
 * @returns {JSX.Element}
 * @constructor
 */
export default function FullScreenQRCode({navigation, route}) {
    const { colors } = useTheme();

    const [data, setData] = useState('');

    React.useEffect(() => {
        if (route.params?.data) {
            // Post updated, do something with `route.params.post`
            // For example, send the post to the server
            setData(route.params.data);
        }
    }, [route.params?.data]);

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
