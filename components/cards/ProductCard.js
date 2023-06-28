import React, { useContext } from "react"
import { Text, Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Cards, Typo, Shadow } from "../../styles"

import YellowPlusButton from "../buttons/YellowPlusButton"

import ActiveBakerProvider from "../../context/ActiveBakerContext"
import AuthProvider from "../../context/AuthContext"

const ProductCard = ({ onPress, imageUri, name, price, kilo_price = "1.70", onPressPlus }) => {

	//Context
	const { active_baker } = useContext(ActiveBakerProvider);
	const { user_data } = useContext(AuthProvider);

	return (
		<TouchableOpacity style={[styles.cardContainer, styles.shadowProp, styles.elevation]}
			onPress={onPress}
		>
			<Image source={{ uri: imageUri }}
				style={styles.cardImg} />
			<Text style={styles.cardTitle}>{name}</Text>
			<Text style={styles.titleXxs}>{`( ${kilo_price} RON/KG )`}</Text>
			<View style={styles.cartOptionsContainer}>
				<Text style={styles.titleSm}>{price} RON</Text>
				{user_data.user_type === "user" && active_baker.id == null ? null : <YellowPlusButton title="+" color="#1D053D" onPress={onPressPlus} />}
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		...Cards.cardContainer
	},

	cardImg: {
		...Cards.cardImg,
	},

	cardTitle: {
		...Cards.cardTitle
	},

	titleSm: {
		...Typo.textSm,
		fontWeight: Typo.light
	},

	titleXxs: {
		...Typo.textXxs,
		fontWeight: Typo.normal,
		letterSpacing: 1
	},

	cartOptionsContainer: {
		display: "flex",
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "auto"
	},

	shadowProp: {
		...Shadow.shadowProp
	},

	elevation: {
		...Shadow.elevation
	}

});

export default ProductCard;