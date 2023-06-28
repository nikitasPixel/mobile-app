import React, { useEffect, useState, useContext } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from "react-native"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import CartProvider from "../context/CartContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import PrimaryButton from "../components/buttons/PrimaryButton"

import supportedLanguages from "../i18n/supportedLanguages"
import t from "../i18n/i18n"
import { Utils, Typo, Lists, Colors, Shadow } from "../styles"

//Concat first letters from client's first and last name function
const concatFirstLetters = (string1, string2) => {
	let letters = string1?.charAt(0).concat((string2?.charAt(0)));
	return letters;
}

const MyAccount = props => {

	//Context
	const { setCartItems } = useContext(CartProvider);
	const { user_data, storeUserData } = useContext(AuthProvider);
	const { setActiveBaker } = useContext(ActiveBakerProvider);

	//State
	const [mz_user, setMzUser] = useState([]);

	const endpoint = user_data.user_type === "baker" ? "bakers" : "users";

	const getUser = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/${endpoint}/${user_data.id}?api_token=${user_data.token}`)
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
				}
			})
			.then((json) => setMzUser(json))
			.catch((error) => console.error(error))
	}

	useEffect(() => {
		getUser();
	}, [])

	return (
		<ScrollView style={styles.container}>
			<View style={styles.firstLettersCircle}>
				<Text style={styles.firstLettersCircleText}>{concatFirstLetters(mz_user?.first_name, mz_user?.last_name)}</Text>
			</View>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>{`${mz_user?.first_name} ${mz_user?.last_name}`}</Text>
			</View>
			{user_data.user_type !== "baker" ? null :
				<View style={[styles.infoCard, styles.shadowProp, styles.elevation]}>
					<Text style={styles.infoTitle}>{t(supportedLanguages.addressField)}</Text>
					<Text style={styles.infoText}>{mz_user ? mz_user.address : ""}</Text>
				</View>}
			{user_data.user_type !== "baker" ? null :
				<View style={[styles.infoCard, styles.shadowProp, styles.elevation]}>
					<Text style={styles.infoTitle}>{t(supportedLanguages.bakeryNameField)}</Text>
					<Text style={styles.infoText}>{mz_user ? mz_user.bakery_name : ""}</Text>
				</View>}
			{user_data.user_type !== "baker" ? null :
				<View style={[styles.infoCard, styles.shadowProp, styles.elevation]}>
					<Text style={styles.infoTitle}>{t(supportedLanguages.zeeSalesRepInfoField)}</Text>
					<Text style={styles.infoText}>{t(supportedLanguages.fullNameField)}{": "}{mz_user ? mz_user?.user?.first_name + "  " + mz_user?.user?.last_name : ""}</Text>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text style={styles.infoText}>{t(supportedLanguages.phoneNumberField)}{": "}</Text>
						<TouchableOpacity onPress={() => Linking.openURL(`tel:${mz_user?.user?.phone_number}`)}>
							<Text style={{ color: "#B19FCD" }}>{mz_user?.user?.phone_number}</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: "row", alignItems: "center" }}>
						<Text style={styles.infoText}>{t(supportedLanguages.emailField)}{": "} </Text>
						<TouchableOpacity onPress={() => Linking.openURL(`mailto:${mz_user?.user?.email}`)}>
							<Text style={{ color: "#B19FCD", alignSelf: "center" }}>{mz_user?.user?.email}</Text>
						</TouchableOpacity>
					</View>
				</View>}
			<PrimaryButton title={t(supportedLanguages.logoutBtn)} onPress={() => { storeUserData(Env.DEFAULT_USER_DATA), setCartItems([]), setActiveBaker({ id: null, first_name: "", last_name: "" }) }} />
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

	firstLettersCircleText: {
		...Typo.textXl,
		fontWeight: Typo.normal,
		color: Colors.aubergine
	},

	titleContainer: {
		width: "50%",
		alignSelf: "center",
		borderBottomColor: Colors.lightGray,
		borderBottomWidth: 1,
		marginBottom: 20
	},

	title: {
		...Typo.textMd,
		fontWeight: Typo.semiBold,
		color: Colors.royalPurple,
		paddingTop: 40,
		paddingBottom: 20,
		textAlign: "center",
	},

	infoCard: {
		...Lists.multiLineListItem,
		flexDirection: "column",
		alignItems: "flex-start",
		height: "auto",
		minHeight: 70
	},

	shadowProp: {
		...Shadow.shadowProp
	},

	elevation: {
		...Shadow.elevation
	},

	infoTitle: {
		...Lists.multiLineListItemTitle,
		fontWeight: Typo.normal,
		paddingVertical: 5,
		color: Colors.aubergine,
	},

	infoText: {
		...Lists.multiLineListItemText,
		fontWeight: Typo.normal,
		paddingVertical: 5,
		color: Colors.aubergine,
	}

});

export default MyAccount;