import React from "react"
import { View, Text, TouchableOpacity } from "react-native"
import {accordionContainer, accordionHeader, accordionBody, accordionHeaderTitle, accordionHeaderIcon } from "../styles/utils";

const Accordion = ({ title, children, expanded, onPress, style, uuid }) => {
    return (
        <View style={[accordionContainer, style]}>
            <TouchableOpacity
                onPress={onPress}
                style={accordionHeader}
            >
                <Text style={accordionHeaderTitle}>{title}</Text>
                <Text style={accordionHeaderIcon}>{expanded ? "-" : "+"}</Text>
            </TouchableOpacity>
            {expanded && (
                <View style={accordionBody}>
                    {children}
                </View>
            )}
        </View>
    );
};

export default Accordion;