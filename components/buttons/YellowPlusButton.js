import React from "react";
import { Text, StyleSheet, TouchableOpacity } from "react-native";
import { Buttons } from "../../styles";

const YellowPlusButton = props => {
    return (
        <TouchableOpacity style={styles.yellowBtn} onPress={props.onPress}>
            <Text style={styles.yellowBtnText}>{props.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    yellowBtn: {
        ...Buttons.yellowPlus,
        alignSelf: "flex-end",
        justifyContent: "center"
    },

    yellowBtnText: {
        ...Buttons.primaryText,
    }

});

export default YellowPlusButton;