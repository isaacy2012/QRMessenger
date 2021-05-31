import Constants from "expo-constants";
import {StyleSheet} from 'react-native';

export const styles = (colors) => StyleSheet.create({
    app: {
        flex: 1,
        padding: 24,
    },
    input: {
        height: 40,
        margin: 12,
        textAlign: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 8,
        borderColor: "#AAAAAA",
        color: colors.text
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingTop: Constants.statusBarHeight,
        //backgroundColor: '#ecf0f1',
        padding: 8,
    },
    paragraph: {
        margin: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    card: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 12,
        borderRadius: 10,
        // shadowColor: "#000",
        // shadowOffset: {
        //     width: 0,
        //     height: 5,
        // },
        // shadowOpacity: colors.dark ? 0 : 0.10,
        // shadowRadius: 12,
        elevation: 10,
        backgroundColor: colors.card
    },
    qrcode: {
        alignItems: 'center',
        display: 'flex',
        marginVertical: 20,
        backgroundColor: "#ffffff",
        alignSelf: 'center',
        padding: 8,
        borderRadius: 6
    },
    titleText: {
        marginHorizontal: 20,
        marginVertical: 20,
        fontSize: 30,
        fontWeight: "bold",
        color: colors.text
    },
    heading: {
        marginHorizontal: 12,
        marginVertical: 10,
        fontSize: 24,
        fontWeight: "600",
        color: colors.text
    },
    receiveText: {
        marginHorizontal: 12,
        marginVertical: 10,
        color: colors.text
    },
    invisible: {display: 'none'},
});
