import React from "react";
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native";

//TODO: Implement new design
const PromoProductCard = props => {
	return (
		<TouchableOpacity style={styles.item}
			onPress={props.onPress}
		>
			<Image source={{ uri: props.imageUri }}
				style={styles.cardImg} />
			<Text style={styles.title}>{props.name} </Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	item: {
		justifyContent: "space-around",
		backgroundColor: "#F9F8F6",
		width: "45%",
		height: 188,
		padding: 10,
		margin: 10,
	},
	
	cardImg: {
		height: 117,
		width: 136,
		resizeMode: "contain",
		alignSelf: "center"
	},

	title: {
		fontFamily: "OpenSans-Regular",
		fontSize: 16,
		lineHeight: 16,
		color: "#1D053D",
		alignSelf: "center"
	},

});

export default PromoProductCard;