import React, { useEffect } from "react"
import { View, StyleSheet, Image, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"

import supportedLanguages from "../i18n/supportedLanguages"
import t from "../i18n/i18n"

import { Utils } from "../styles"

const ResetLinkSent = (props) => {

    //Navigation
    const data = props.route.params.data;
    const navigation = useNavigation();

    //Dialog
    const customAlert = (message) => {
        //TODO: Add icons
        Alert.alert('', message, [
            {
                text: 'OK',
                onPress: () => navigation.navigate("Login"),
            },
        ]);
    }

    useEffect(() => {
        if (data.error) {
            customAlert(t(supportedLanguages.linkSentFailMsg))
        } else {
            customAlert(t(supportedLanguages.linkSentSuccessMsg))
        }
    })

    return (
        <View style={styles.container}>
            <View style={{ alignItems: "center" }}>
                <Image source={require("../assets/logos/zeelandia_logo.png")} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...Utils.container,
        paddingTop: 100,
        alignItems: "center"
    },

});

export default ResetLinkSent;
