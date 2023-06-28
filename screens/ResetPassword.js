import React, { useState } from "react"
import { View, StyleSheet, Text, TextInput, Image, TouchableOpacity } from "react-native"
import { useNavigation } from '@react-navigation/native'

import PrimaryButton from "../components/buttons/PrimaryButton"

import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Colors, Typo, Forms, Utils } from "../styles"

const ResetPassword = () => {

    //Navigation
    const navigation = useNavigation();

    //State
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")

    //Post email
    const postEmail = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/send_token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: email })
        })
            .then((response) => response.json())
            .then(data => {
                navigation.navigate("ResetLinkSent", { data: data })
            })
            .catch((error) => console.error(error))
    }

    //Event handlers
    const handleReset = () => {
        if (email !== "") {
            postEmail();
        } else {
            setError(t(supportedLanguages.mandatoryErrorMsg))
        }
    }

    return (
        <View style={styles.container}>
            <View style={{ alignSelf: "flex-start", paddingHorizontal: 20 }}>
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20 }}>
                    <Image source={require("../assets/icons/arrow-circle-left.png")} />
                    <Text style={[styles.text, { paddingLeft: 5, marginTop: 0 },]}>Go back</Text>
                </TouchableOpacity>
            </View>
            <View style={{ alignItems: "center" }}>
                <Image source={require("../assets/logos/zeelandia_logo.png")} />
                <Text style={styles.text}>{t(supportedLanguages.resetPasswordText)}</Text>
            </View>
            <View style={{ marginTop: 30 }}>
                <Text style={styles.label}>{t(supportedLanguages.emailField)}</Text>
                <TextInput style={styles.textInput}
                    placeholder=""
                    value={email}
                    onChange={(e) => setEmail(e.nativeEvent.text)}
                    onEndEditing={(e) => {
                        if (e.nativeEvent.text === "") {
                            setError(t(supportedLanguages.mandatoryErrorMsg))
                        } else {
                            setError("")
                        }
                    }}
                />
                {error !== "" && <Text style={styles.errorMsg}>{error}</Text>}
            </View>
            <View style={{ marginTop: "25%", marginBottom: 20 }}>
                <PrimaryButton title={t(supportedLanguages.resetPasswordBtn)} color={Colors.aubergine} onPress={handleReset} />
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

    textInput: {
        ...Forms.textInput
    },

    text: {
        ...Typo.textSm,
        fontWeight: Typo.light,
        color: Colors.aubergine,
        marginTop: 20,
        textAlign: "center"
    },

    label: {
        ...Forms.inputLabel
    },

    errorMsg: {
        ...Forms.errorMsg
    },

});

export default ResetPassword;
