import React, { useState, useContext } from "react"
import { View, StyleSheet, Text, TextInput, Image, Linking, TouchableOpacity, ScrollView, KeyboardAvoidingView } from "react-native"
import PrimaryButton from "../components/buttons/PrimaryButton"
import AuthProvider from "../context/AuthContext"
import Env from "../context/Env"
import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Colors, Typo, Forms, Utils } from "../styles"
const CreatePassword = props => {

    //Context
    const { storeUserData } = useContext(AuthProvider)

    //Navigation
    const { email: user_email, token } = props.route.params;

    //State
    const [inputFields, setInputFields] = useState({ newPassword: "", repeatPassword: "" })
    const [hint, setHint] = useState(t(supportedLanguages.shortValueErrorMsg))
    const [placeholder, setPlaceholder] = useState("********")
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState("")
    const [repeatPasswordErrorMessage, setRepeatPasswordErrorMessage] = useState("")

    //Post user
    const postUser = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/reset_password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: user_email, token: token, password: inputFields.newPassword })
        })
            .then((response) => response.json())
            .then(data => {
                if (data.error) {
                    throw Error(data.error)
                }
                storeUserData(data)
            })
            .catch((error) => console.error(error))
    }

    //Event handlers
    const handlePasswordsChange = (value, validator, setError, validator_error) => {
        if (value === "") {
            setError(t(supportedLanguages.mandatoryErrorMsg))
        } else if (!validator(value)) {
            setError(validator_error)
        } else {
            setError("");
        }
    }

    //Password length validator
    const isPasswordValid = (password) => password.length >= 8

    const handlePasswordsSubmit = () => {
        if (newPasswordErrorMessage === "" && repeatPasswordErrorMessage === "") {
            postUser();
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView style={{ backgroundColor: Colors.white }}>
                <View style={styles.container}>
                    <View style={{ alignItems: "center" }}>
                        <Image source={require("../assets/logos/zeelandia_logo.png")} />
                        <Text style={styles.text}>{t(supportedLanguages.createPasswordText)}</Text>
                        <Text style={styles.textSemibold}>{user_email}</Text>
                        <Text style={styles.text}>{t(supportedLanguages.createPasswordSubtext)}</Text>
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.label}>{t(supportedLanguages.newPasswordField)}</Text>
                        <TextInput style={styles.textInput}
                            placeholder={placeholder}
                            value={inputFields.newPassword}
                            secureTextEntry={true}
                            onFocus={() => { setHint(""), setPlaceholder("") }}
                            onChange={(e) => setInputFields({ ...inputFields, newPassword: e.nativeEvent.text })}
                            onEndEditing={e => handlePasswordsChange(e.nativeEvent.text, isPasswordValid, setNewPasswordErrorMessage, t(supportedLanguages.shortValueErrorMsg))}
                        />
                        {hint !== "" && <Text style={styles.hintMsg}>{hint}</Text>}
                        {newPasswordErrorMessage !== "" && <Text style={styles.errorMsg}>{newPasswordErrorMessage}</Text>}
                    </View>
                    <View style={{ marginTop: 30 }}>
                        <Text style={styles.label}>{t(supportedLanguages.repeatPasswordField)}</Text>
                        <TextInput style={styles.textInput}
                            secureTextEntry={true}
                            placeholder=""
                            value={inputFields.repeatPassword}
                            onChange={(e) => setInputFields({ ...inputFields, repeatPassword: e.nativeEvent.text })}
                            onEndEditing={e => handlePasswordsChange(e.nativeEvent.text, (password) => password === inputFields.newPassword, setRepeatPasswordErrorMessage, t(supportedLanguages.noMatchErrorMsg))}
                        />
                        {repeatPasswordErrorMessage !== "" && <Text style={styles.errorMsg}>{repeatPasswordErrorMessage}</Text>}
                    </View>
                    <View style={{ marginTop: 50 }}>
                        <Text style={styles.text}>{t(supportedLanguages.tcText)}</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(`${Env.SCHEME}://${Env.HOST}/terms`)}>
                            <Text style={styles.textSemibold}>{t(supportedLanguages.tcLink)}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: "auto", marginBottom: 20 }}>
                        <PrimaryButton title={t(supportedLanguages.createAccountBtn)} onPress={handlePasswordsSubmit} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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

    textSemibold: {
        ...Typo.textSm,
        fontWeight: Typo.semiBold,
        color: Colors.aubergine,
        textAlign: "center"
    },

    label: {
        ...Forms.inputLabel
    },

    errorMsg: {
        ...Forms.errorMsg
    },

    hintMsg: {
        ...Forms.hintMsg
    },
});
export default CreatePassword;