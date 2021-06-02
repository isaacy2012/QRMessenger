import * as React from 'react';
import {Alert, SafeAreaView, SectionList, Text, TouchableHighlight, View} from 'react-native';
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {
    useTheme,
    useFocusEffect
} from "@react-navigation/native";
import Clipboard from "expo-clipboard";
import * as SQLite from "expo-sqlite";
import {useEffect, useState} from "react";


function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

/**
 * Days between
 * @param a first date
 * @param b second date
 * @returns {number}
 */
function daysBetween(a, b) {
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    // Calculating the signed time difference between two dates
    const diffInTime = b.getTime() - a.getTime();
    // Difference in days
    return Math.round(diffInTime / oneDay);
}

/**
 * History Screen
 * @param navigation
 * @param route
 * @returns {JSX.Element} History Screen
 * @constructor
 */
export default function History({navigation, route}) {
    const {colors} = useTheme();
    const db = SQLite.openDatabase('db.db');

    const [HistorySectionViewData, SetHistorySectionViewData] = React.useState([
        {
            title: "Today",
            data: []
        },
        {
            title: "Yesterday",
            data: []
        },
        {
            title: "Older",
            data: []
        },
    ]);

    useFocusEffect(
        React.useCallback(() => {
            Alert.alert("screen was focused");
            // Do something when the screen is focused
            console.log("here");
            db.transaction(tx => {
                tx.executeSql(
                    'create table if not exists items (id integer primary key not null, date text, value text);'
                );
                tx.executeSql('select * from items ordee by id asc', [], (_, {rows}) => {
                        console.log("ROWS");
                        console.log(rows);
                        let temp = [HistorySectionViewData];
                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            if (!temp.includes(item)) {
                                if (isToday(new Date(item.date))) {
                                    temp[0].data.push(item);
                                    //temp[2].data.push("another " + i);
                                } else if (daysBetween(new Date(item.date), new Date()) === 1) {
                                    temp[1].data.push(item);
                                } else {
                                    temp[2].data.push(item);
                                }
                            }
                        }
                        SetHistorySectionViewData(temp);
                        console.log(temp);
                    }
                );
            });
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );



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

    function Item({item}) {
        return (
            <TouchableHighlight
                activeOpacity={0.6}
                onPress={() => copyToClipboard({data: item.value})}
                onLongPress={() => copyToClipboardWithAlert({data: item.value})}
            >
                <Card style={styles(colors).card}>
                    <Text style={styles(colors).receiveText}>{item.value}</Text>
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
                extraData={HistorySectionViewData}
                ListHeaderComponent={() => <Title/>}
                keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item item={item}/>}
                renderSectionHeader={({section: {title}}) => <Header title={title}/>}
            />
        </SafeAreaView>
    );
}
