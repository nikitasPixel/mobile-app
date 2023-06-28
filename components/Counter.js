import React from "react"
import { Text, View, StyleSheet, TouchableOpacity, } from "react-native"

import { Typo, Colors } from "../styles"

const Counter = props => {
    return (
        <View style={[styles.counterContainer, props.style]}>
            <TouchableOpacity onPress={props.onPressMinus}>
                <Text style={styles.textMd}>-</Text>
            </TouchableOpacity>
            <View style={styles.countContainer}>
                <Text style={styles.textMd}>{props.count}</Text>
            </View> 
            <TouchableOpacity onPress={props.onPressPlus}>
                <Text style={styles.textMd}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    counterContainer: {
        width: 167,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        padding: 5,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.lightGray,
        borderRadius: 43,
    },

    textMd: {
        ...Typo.textMd,
        fontWeight: Typo.normal,
        color: Colors.aubergine
    },

    countContainer: {
        paddingHorizontal: 20,
        borderLeftWidth: 1,
        borderLeftColor: Colors.gray,
        borderRightWidth: 1,
        borderRightColor: Colors.gray
    }

});

export default Counter;