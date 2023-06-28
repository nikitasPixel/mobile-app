import React, { useEffect, useState, useContext } from "react"
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Alert } from "react-native"
import VectorImage from 'react-native-vector-image'
import { Colors, Typo, Lists, Shadow, Utils } from "../styles"

import AuthProvider from "../context/AuthContext"
import Env from "../context/Env"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

import supportedLanguages from "../i18n/supportedLanguages"
import t from "../i18n/i18n"

//Concat first letters from client's first and last name function
const concatFirstLetters = (string1, string2) => {
	let letters = string1?.charAt(0).concat((string2?.charAt(0)));
	return letters;
}

const ClientDetails = props => {

	//Navigation
	const id = props.route.params.id;

	//Context
	const { user_data, storeUserData } = useContext(AuthProvider);
	const { setActiveBaker } = useContext(ActiveBakerProvider);
	const { setCartItems } = useContext(CartProvider)

	//State
	const [client, setClient] = useState({});

	const getClient = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/bakers/${id}?api_token=${user_data.token}`)
			.then(response => {
				const type = response.headers.get("content-type");
				if (type && type.indexOf("application/json") !== -1) {
					return response.json()
				} else {
					Alert.alert('Your session has expired', '', [
						{
							text: 'OK',
							onPress: () => { storeUserData(Env.DEFAULT_USER_DATA), setCartItems([]), setActiveBaker({ id: null, first_name: "", last_name: "" }) },
						},
					]);
					throw Error("session expired")
				}
			})
			.then(setClient)
			.catch((error) => console.error(error))
	}
	useEffect(() => {
		getClient();
		console.log(client);
	}, []);

	//Client Details Component
	return (
		<ScrollView style={styles.container}>
			<View style={styles.firstLettersCircle}>
				<Text style={styles.textXl}>{concatFirstLetters(client.first_name, client.last_name)}</Text>
			</View>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>{client?.first_name} {client?.last_name}</Text>
			</View>
			<TouchableOpacity onPress={() => [
				setActiveBaker(client),
				props.navigation.navigate("Cart")
			]}
				style={{ alignSelf: "center", marginVertical: 5 }}
			>
				<View style={[styles.shadowProp, styles.elevation, { height: 60, backgroundColor: Colors.white, borderRadius: 30, justifyContent: "center" }]}>
					<VectorImage style={{ alignSelf: "center" }} source={require("../assets/icons/shopping_list.svg")}>
					</VectorImage>
				</View>
				<Text style={styles.textXs}>{t(supportedLanguages.activeCartBtn)}</Text>
			</TouchableOpacity>
			<View style={[styles.clientInfoListItem, styles.shadowProp, styles.elevation]}>
				<Text style={styles.clientInfoListItemTitle}>{t(supportedLanguages.phoneNumberField)}</Text>
				<Text style={styles.clientInfoListItemText}>{client ? client.phone_number : ""}</Text>
			</View>
			<View style={[styles.clientInfoListItem, styles.shadowProp, styles.elevation]}>
				<Text style={styles.clientInfoListItemTitle}>{t(supportedLanguages.emailField)}</Text>
				<Text style={styles.clientInfoListItemText}>{client ? client.email : ""}</Text>
			</View>
			<View style={[styles.clientInfoListItem, styles.shadowProp, styles.elevation]}>
				<Text style={styles.clientInfoListItemTitle}>{t(supportedLanguages.addressField)}</Text>
				<Text style={styles.clientInfoListItemText}>{client ? client.address : ""}</Text>
			</View>
			<View style={[styles.clientInfoListItem, styles.shadowProp, styles.elevation]}>
				<Text style={styles.clientInfoListItemTitle}>{t(supportedLanguages.bakeryNameField)}</Text>
				<Text style={styles.clientInfoListItemText}>{client ? client.bakery_name : ""}</Text>
			</View>
			<View style={[styles.clientInfoListItem, styles.shadowProp, styles.elevation]}>
				<Text style={styles.clientInfoListItemTitle}>{t(supportedLanguages.websiteField)}</Text>
				<Text style={styles.clientInfoListItemText}>{client ? client.website : ""}</Text>
			</View>
		</ScrollView>
	);

}

const styles = StyleSheet.create({
	container: {
		...Utils.container
	},

	firstLettersCircle: {
		backgroundColor: Colors.lightGray,
		width: 90,
		height: 90,
		borderRadius: 60,
		alignSelf: "center",
		justifyContent: "center",
		alignItems: "center"
	},

	titleContainer: {
		width: "50%",
		alignSelf: "center",
		borderBottomColor: Colors.brightGray,
		borderBottomWidth: 1,
		marginBottom: 20
	},

	title: {
		...Typo.textMd,
		fontWeight: Typo.semiBold,
		paddingTop: 40,
		paddingBottom: 20,
		textAlign: "center",
		color: Colors.royalPurple
	},

	textXs: {
		...Typo.textXs,
		color: Colors.royalPurple,
		textAlign: "center",
		marginVertical: 15
	},

	textXl: {
		...Typo.textXl,
		color: Colors.aubergine
	},

	clientInfoListItem: {
		...Lists.multiLineListItem,
		flexDirection: "column",
		alignItems: "flex-start",
		height: "auto",
		minHeight: 70
	},

	clientInfoListItemTitle: {
		...Lists.multiLineListItemTitle,
		marginBottom: 10,
		textAlign: "center",
	},

	clientInfoListItemText: {
		...Lists.multiLineListItemText,
		width: "100%"
	},

	shadowProp: {
		...Shadow.shadowProp
	},

	elevation: {
		...Shadow.elevation
	},

});

export default ClientDetails;