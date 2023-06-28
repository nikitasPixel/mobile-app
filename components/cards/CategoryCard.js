import React from "react"
import { Text, Image, StyleSheet, TouchableOpacity } from "react-native"
import { Cards, Shadow } from "../../styles"

const CategoryCard = props => {
	return (
		<TouchableOpacity style={[styles.cardContainer, styles.shadowProp, styles.elevation]}
			onPress={props.onPress}
		>
			<Image source={{ uri: props.imageUri }}
				style={styles.cardImg} />
			<Text style={styles.cardTitle}>{props.name} </Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	cardContainer: {
		...Cards.cardContainer
	},

	cardImg: {
		...Cards.cardImg
	},

	cardTitle: {
		...Cards.cardTitle
	},

	shadowProp: {
		...Shadow.shadowProp
	},

	elevation: {
		...Shadow.elevation
	},

});

export default CategoryCard;