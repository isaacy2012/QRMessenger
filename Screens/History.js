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



/**
 * History Screen
 * @param navigation
 * @param route
 * @returns {JSX.Element} History Screen
 * @constructor
 */
export default function History({navigation, route}) {
    const {colors} = useTheme();

    return (
        <SafeAreaView style={styles(colors).app}>
            <KeyboardAwareScrollView style={styles(colors).scrollView}>
                <Text style={styles(colors).titleText}>
                    History
                </Text>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
