import * as React from 'react';
import {
    Text,
    SafeAreaView,
    SectionList,
    TouchableOpacity,
    Button,
    View,
    TouchableHighlight, Alert
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview'
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {useTheme} from "@react-navigation/native";
import {useState} from "react";
import {BlurView} from 'expo-blur';
import Clipboard from "expo-clipboard";

const TodayData = [
    "Burger", "01235178235", "SampleData"
]

const HistorySectionViewData = [
    {
        title: "Today",
        data: TodayData
    },
    {
        title: "Yesterday",
        data: ["Yesterday data", "yesterday", "Good"]
    },
    {
        title: "Older",
        data: ["Even older data", "Remember to pickup", "1264912674"]
    },
];


/**
 * History Screen
 * @param navigation
 * @param route
 * @returns {JSX.Element} History Screen
 * @constructor
 */
export default function History({navigation, route}) {
    const {colors} = useTheme();

    /**
     * When QRCode is scanned
     * @param data the data recieved
     */
    function copyToClipboard({data}) {
        //Copy to clipboard
        Clipboard.setString(String(data));
    }

    function copyToClipboardWithAlert({data}) {
        Alert.alert("Copied!", 'Copied to clipboard!');
        copyToClipboard({data});
    }

    function Item({data}) {
        return (
            <TouchableHighlight
                activeOpacity={0.6}
                onPress={() => copyToClipboard({data})}
                onLongPress={() => copyToClipboardWithAlert({data})}
            >
                <Card style={styles(colors).card}>
                    <Text style={styles(colors).receiveText}>{data}</Text>
                </Card>
            </TouchableHighlight>
        );
    }

    function Title() {
        return (
            <Text style={styles(colors).titleText}>History</Text>
        );
    }

    function Header({title}) {
        return (
            <View
                style={{
                    marginHorizontal: 16,
                    backgroundColor: colors.background
                }}
            >
                <Text style={styles(colors).heading}>{title}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles(colors).app}>
            <SectionList
                sections={HistorySectionViewData}
                ListHeaderComponent={() => <Title/>}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item data={item}/>}
                renderSectionHeader={({section: {title}}) => <Header title={title}/>}
            />
        </SafeAreaView>
    );
}
