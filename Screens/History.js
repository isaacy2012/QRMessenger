import * as React from 'react';
import {Alert, Button, SafeAreaView, SectionList, Text, TouchableHighlight, View} from 'react-native';
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {
    useTheme,
    useFocusEffect
} from "@react-navigation/native";
import Clipboard from "expo-clipboard";
import * as SQLite from "expo-sqlite";
import {useEffect, useState} from "react";
import {shouldThrowAnErrorOutsideOfExpo} from "expo/build/environment/validatorState";

/**
 * Today
 * @returns {Date}
 */
function todayDate() {
    const ret = new Date();
    ret.setHours(0,0,0,0);
    return ret;
}

/**
 * Checks if a day is today
 * @param date
 * @returns {boolean}
 */
function isToday(date) {
    const today = todayDate();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

/**
 * Days between
 * @param date first date
 * @returns {number}
 */
function daysSince(date) {
    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;
    // Calculating the signed time difference between two dates
    const diffInTime = todayDate().getTime() - date.getTime();
    // Difference in days
    return Math.round(diffInTime / oneDay);
}

function compareItem(a, b) {
    if (a.id !== b.id) {
        return false;
    }
    if (a.value !== b.value) {
        return false;
    }
    if (a.date !== b.date) {
        return false;
    }
    return true;
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
    const [changed, setChanged] = useState(false);
    const [todayItems, setTodayItems] = useState([]);
    const [yesterdayItems, setYesterdayItems] = useState([]);
    const [olderItems, setOlderItems] = useState([]);
    const [HistorySVData, setHistorySVData] = useState([]);

    function clearTable() {
        db.transaction(tx => {
            tx.executeSql(
                'delete from items'
            );
            //reset all items
            setTodayItems([]);
            setYesterdayItems([]);
            setOlderItems([]);
            console.log(HistorySVData);
        });
    }

    /**
     * Refresh the section list from the data in the database
     */
    function refreshSectionList() {
        db.transaction(tx => {
                tx.executeSql(
                    'create table if not exists items (id integer primary key not null, date text, value text);'
                );
                tx.executeSql('select * from items order by id asc', [], (_, {rows}) => {
                        //console.log(rows);
                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            if (isToday(new Date(item.date))) {
                                if (todayItems.some(el => compareItem(el, item)) === false) {
                                    todayItems.unshift(item);
                                }
                            } else if (daysSince(new Date(item.date)) === 1) {
                                if (yesterdayItems.some(el => compareItem(el, item)) === false) {
                                    yesterdayItems.unshift(item);
                                }
                            } else {
                                console.log("diff was : " + daysSince(new Date(item.date)));
                                console.log("since todayDate was " + todayDate());
                                if (olderItems.some(el => compareItem(el, item)) === false) {
                                    olderItems.unshift(item);
                                }
                            }
                            setTodayItems(todayItems);
                            setYesterdayItems(yesterdayItems);
                            setOlderItems(olderItems);
                            let tempHistorySVData = [];
                            if (todayItems.length > 0) {
                                tempHistorySVData.push({title:"Today", data:todayItems});
                            }
                            if (yesterdayItems.length > 0) {
                                tempHistorySVData.push({title:"Yesterday", data:yesterdayItems});
                            }
                            if (olderItems.length > 0) {
                                tempHistorySVData.push({title:"Older", data:olderItems});
                            }
                            setHistorySVData(tempHistorySVData);
                            console.log(tempHistorySVData);
                        }
                    }
                );
            }
            , undefined
            , function after() {
                console.log(HistorySVData);
                console.log("updating");
                setChanged(changed => !changed);
            }
        );
    }

    useFocusEffect(
        React.useCallback(() => {
            // Do something when the screen is focused
            console.log("here");
            refreshSectionList();
            return () => {
                // Do something when the screen is unfocused
                // Useful for cleanup functions
            };
        }, [])
    );


    /**
     * When QRCode is scanned
     * @param data the data received
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


    //console.log("drawn");
    return (
        <SafeAreaView style={styles(colors).app}>
            <SectionList
                sections={HistorySVData}
                extraData={changed}
                ListHeaderComponent={() => <Title/>}
                // keyExtractor={(item, index) => item + index}
                renderItem={({item}) => <Item item={item}/>}
                renderSectionHeader={({section: {title}}) => <Header title={title}/>}
            />
            <Button
                onPress={() => clearTable()}
                title="Clear"
            />
        </SafeAreaView>
    );
}
