import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import VectorImage from 'react-native-vector-image';

import { Shadow, Lists} from "../../styles"

const ClientCard = props => {
    //Concat first letters from client's first and last namevfunction
    const concatFirstLetters = (string1, string2) => {
        let letters = string1.charAt(0).concat((string2.charAt(0)));
        return letters;
    }

    const [showIcon, setShowIcon] = useState(true);

    useEffect(() => {
        // Change the state every second or the time given by User.
        const interval = setInterval(() => {
            setShowIcon((showIcon) => !showIcon);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <TouchableOpacity style={[styles.clientListItem, styles.shadowProp, styles.elevation]} onPress={props.onPress}>
            <View style={styles.clientListItemImg}>
                <Text style={styles.clientListItemImgText}>{concatFirstLetters(props.first_name, props.last_name)}</Text>
            </View>
            <Text style={styles.clientListItemText}>{props.first_name} {props.last_name} </Text>
            {!props.pending ? null :
                <VectorImage source={require("../../assets/icons/shopping_list.svg")} style={{ display: showIcon ? "none" : "flex", marginRight: 20 }} />}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    clientListItem: {
        ...Lists.singleLineListItem
    },

    clientListItemImg: {
        ...Lists.singleLineListItemImg
    },

    clientListItemImgText: {
        ...Lists.singleLineListItemImgText
    },

    clientListItemText: {
        ...Lists.singleLineListItemText
    },

    shadowProp: {
        ...Shadow.shadowProp
    },

    elevation: {
        ...Shadow.elevation
    },


});

export default ClientCard;