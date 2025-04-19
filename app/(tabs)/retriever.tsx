import SmsRetriever from 'react-native-sms-retriever';
import {StyleSheet, View, Text, Button} from "react-native";
import React from "react";
import EditScreenInfo from "@/components/EditScreenInfo";

// Get the phone number (first gif)
const _onPhoneNumberPressed = async () => {
    try {
        const phoneNumber = await SmsRetriever.requestPhoneNumber();
    } catch (error) {
        console.log(JSON.stringify(error));
    }
};

// Get the SMS message (second gif)
const _onSmsListenerPressed = async () => {
    try {
        const registered = await SmsRetriever.startSmsRetriever();
        if (registered) {
            await SmsRetriever.addSmsListener(event => {
                console.log(event.message);
                SmsRetriever.removeSmsListener();
            });
        }
    } catch (error) {
        console.log(JSON.stringify(error));
    }
};


export default function RetrieverScreen() {
    return (
        <>
            <View style={styles.container}>
                <Text style={styles.title}>Retriever</Text>
                <View style={styles.separator}/>
                <EditScreenInfo path="app/(tabs)/retriever.tsx"/>
            </View>

            <Button title={"Start retriever"} onPress={() => _onPhoneNumberPressed()}/>
            <Button title={"Start listener"} onPress={() => _onSmsListenerPressed()}/>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});