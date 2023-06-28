import React, { useState, useContext } from "react"
import { ScrollView, View, StyleSheet, Text, TextInput, Image, TouchableOpacity, KeyboardAvoidingView } from "react-native"

import PrimaryButton from "../components/buttons/PrimaryButton"

import AuthProvider from "../context/AuthContext"
import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Colors, Typo, Forms, Utils } from "../styles"

const Login = (props) => {

	//Context
	const { storeUserData } = useContext(AuthProvider);

	//State
	const [inputFields, setInputFields] = useState({ email: "", password: "" })
	const [emailError, setEmailError] = useState("")
	const [passwordError, setPasswordError] = useState("")
	const [loading, setLoading] = useState(false)

	//Get user
	const getUser = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email: inputFields.email, password: inputFields.password })
		})
			.then((response) => response.json())
			.then(data => {
				if (data.error) {
					setPasswordError(t(supportedLanguages.incorrectErrorMsg))
					throw Error(t(supportedLanguages.incorrectErrorMsg))
				}
				storeUserData(data)
			})
			.catch((error) => console.error(error))
			.finally(() => setLoading(false))
	}

	//Event handlers
	const handleLogin = () => {
		const { email, password } = inputFields;

		if (!email) {
			setEmailError(t(supportedLanguages.mandatoryErrorMsg))
		} else if (!password) {
			setPasswordError(t(supportedLanguages.mandatoryErrorMsg))
		} else {
			setLoading(true);
			getUser();
		}
	}

	if (loading) {
		return (
			<Text>Loading...</Text>
		);
	}

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.container}
		>
			<ScrollView>
				<View style={{ alignItems: "center" }}>
					<View style={{ alignItems: "center" }}>
						<Image source={require("../assets/logos/zeelandia_logo.png")} />
						<Text style={styles.text}>{t(supportedLanguages.welcomeBackText)}</Text>
						<Text style={styles.text}>{t(supportedLanguages.loginText)}</Text>
					</View>
					<View style={{ marginTop: 30 }}>
						<Text style={styles.label}>{t(supportedLanguages.emailField)}</Text>
						<TextInput style={styles.textInput}
							placeholder=""
							value={inputFields.email}
							onChange={(e) => setInputFields({ ...inputFields, email: e.nativeEvent.text })}
							onEndEditing={(e) => {
								if (e.nativeEvent.text === "") {
									setEmailError(t(supportedLanguages.mandatoryErrorMsg))
								} else {
									setEmailError("")
								}
							}}
						/>
						{emailError !== "" && <Text style={styles.errorMsg}>{emailError}</Text>}
					</View>
					<View style={{ marginTop: 30 }}>
						<Text style={styles.label}>{t(supportedLanguages.passwordField)}</Text>
						<TextInput style={styles.textInput}
							secureTextEntry={true}
							placeholder=""
							value={inputFields.password}
							onChange={(e) => setInputFields({ ...inputFields, password: e.nativeEvent.text })}
							onEndEditing={(e) => {
								if (e.nativeEvent.text === "") {
									setPasswordError(t(supportedLanguages.mandatoryErrorMsg))
								} else {
									setPasswordError("")
								}
							}} />
						{passwordError !== "" && <Text style={styles.errorMsg}>{passwordError}</Text>}
					</View>
					<View style={{ alignSelf: "flex-start", marginTop: 20 }}>
						<TouchableOpacity onPress={() => props.navigation.navigate("ResetPassword")}>
							<Text style={styles.textSemibold}>{t(supportedLanguages.forgotPasswordText)}</Text>
						</TouchableOpacity>
					</View>
					<View style={{ marginTop: "25%", marginBottom: 20 }}>
						<PrimaryButton title={t(supportedLanguages.loginBtn)} color={Colors.aubergine} onPress={handleLogin} />
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
		height: "auto",
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

	textSemibold: {
		...Typo.textSm,
		fontWeight: Typo.semiBold,
		color: Colors.aubergine,
		paddingHorizontal: 35
	}

});

export default Login;
