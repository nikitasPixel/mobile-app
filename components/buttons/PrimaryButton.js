import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { Buttons } from "../../styles"

const PrimaryButton = props => {
	return (
		<TouchableOpacity style={!props.disabled ? [styles.btn, props.style] : styles.disabledState} disabled={props.disabled} onPress={props.onPress}>
			<Text style={!props.disabled ? styles.btnText : styles.disabledText}>{props.title}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	btn: {
		...Buttons.primary
	},

	btnText: {
		...Buttons.primaryText
	},

	disabledState: {
		...Buttons.disabled
	},

	disabledText: {
		...Buttons.disabledText
	}

});

export default PrimaryButton;