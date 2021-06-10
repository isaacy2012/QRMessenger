import * as React from 'react';
import {Alert, Button, Platform, SafeAreaView, SectionList, Text, TouchableHighlight, View} from 'react-native';
import {Card} from 'react-native-paper';
import {styles} from "../Styles";
import {
    useTheme,
    useFocusEffect
} from "@react-navigation/native";
import Clipboard from "expo-clipboard";
import * as SQLite from "expo-sqlite";
import {useEffect, useState} from "react";
import {ActionSheetProvider, useActionSheet} from '@expo/react-native-action-sheet'


/**
 * Today
 * @returns {Date}
 */
function todayDate() {
    const ret = new Date();
    ret.setHours(0, 0, 0, 0);
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
    //TODO merge all three into dict since **each useState should be one slice of state**
    //https://stackoverflow.com/questions/55130032/how-to-call-multi-setter-usestate-react-hooks
    const [items, setItems] = useState({
        todayItems: [],
        yesterdayItems: [],
        olderItems: [],
        HistorySVData: [],
    })

    // const [todayItems, setTodayItems] = useState([]);
    // const [yesterdayItems, setYesterdayItems] = useState([]);
    // const [olderItems, setOlderItems] = useState([]);
    // const [HistorySVData, setHistorySVData] = useState([]);

    function clearTable() {
        db.transaction(tx => {
            tx.executeSql(
                'delete from items'
            );
            //reset all items
            setItems({
                todayItems: [],
                yesterdayItems: [],
                olderItems: [],
                HistorySVData: [],
            })
            console.log(items.HistorySVData);
        });
    }

    /**
     * Build historySVData
     */
    function buildHistorySVData() {
        //reset HistorySVData
        items.HistorySVData = [];
        if (items.todayItems.length > 0) {
            items.HistorySVData.push({title: "Today", data: items.todayItems});
        }
        if (items.yesterdayItems.length > 0) {
            items.HistorySVData.push({title: "Yesterday", data: items.yesterdayItems});
        }
        if (items.olderItems.length > 0) {
            items.HistorySVData.push({title: "Older", data: items.olderItems});
        }
    }


    function deleteItemAtIndex(id) {
        console.log("deleted: " + id);
        db.transaction(tx => {
                tx.executeSql(
                    'delete from items where id = ?', [id]
                );
                tx.executeSql('select * from items order by id asc', [], (_, {rows}) => {
                    console.log(rows);
                });
            }
        )
        //only keep items with a different id to the deleted id
        items.todayItems = items.todayItems.filter(x => x.id !== id);
        items.yesterdayItems = items.yesterdayItems.filter(x => x.id !== id);
        items.olderItems = items.olderItems.filter(x => x.id !== id);

        buildHistorySVData();

        setItems({
            ...items
        })
        setChanged(changed => !changed);
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
                        items.todayItems = [];
                        items.yesterdayItems = [];
                        items.olderItems = [];

                        console.log(rows);
                        for (let i = 0; i < rows.length; i++) {
                            let item = rows.item(i);
                            if (isToday(new Date(item.date))) {
                                if (items.todayItems.some(el => compareItem(el, item)) === false) {
                                    items.todayItems.unshift(item);
                                }
                            } else if (daysSince(new Date(item.date)) === 1) {
                                if (items.yesterdayItems.some(el => compareItem(el, item)) === false) {
                                    items.yesterdayItems.unshift(item);
                                }
                            } else {
                                console.log("diff was : " + daysSince(new Date(item.date)));
                                console.log("since todayDate was " + todayDate());
                                if (items.olderItems.some(el => compareItem(el, item)) === false) {
                                    items.olderItems.unshift(item);
                                }
                            }
                            buildHistorySVData();
                            setItems({
                                ...items
                            })
                            console.log(items.HistorySVData);
                        }
                    }
                );
            }
            , undefined
            , function after() {
                console.log(items.HistorySVData);
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
        const {showActionSheetWithOptions} = useActionSheet();
        const buttons = ['Copy', 'Delete', 'Cancel'];
        const COPY = 0;
        const DELETE = 1;
        const CANCEL = 2;
        const options = {
            options: buttons,
            cancelButtonIndex: CANCEL,
            destructiveButtonIndex: DELETE,
        };
        return (
            <TouchableHighlight
                activeOpacity={0.6}
                onPress={() => copyToClipboard({data: item.value})}
                onLongPress={() => {
                    showActionSheetWithOptions(
                        options,
                        buttonIndex => {
                            switch (buttonIndex) {
                                case COPY: {
                                    copyToClipboard({data: item.value});
                                    break;
                                }
                                case DELETE: {
                                    deleteItemAtIndex(item.id);
                                    break;
                                }
                            }
                        }
                    )
                }
                }//copyToClipboardWithAlert({data: item.value})}
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


    console.log("drawn");
    console.log(items.HistorySVData);
    return (
        <ActionSheetProvider>
            <SafeAreaView style={styles(colors).app}>
                {/*Used for debugging only*/}
                {/*<Button*/}
                {/*    onPress={() => clearTable()}*/}
                {/*    title="Clear"*/}
                {/*/>*/}
                <SectionList
                    sections={items.HistorySVData}
                    extraData={changed}
                    ListHeaderComponent={() => <Title/>}
                    // keyExtractor={(item, index) => item + index}
                    renderItem={({item}) => <Item item={item}/>}
                    renderSectionHeader={({section: {title}}) => <Header title={title}/>}
                />
            </SafeAreaView>
        </ActionSheetProvider>
    );
}
