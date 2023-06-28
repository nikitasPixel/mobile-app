import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity, FlatList, Image } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Search = (props) => {

    //State
    const [recents_list, setRecentsList] = useState([]);

    //AsyncStorage
    const parseRecents = async () => {
        try {
            let recents = await AsyncStorage.getItem('recents') || '[]';
            recents = JSON.parse(recents);
            setRecentsList(recents);
        } catch (error) {
            console.log(error)
        }
    }

    const clearRecents = async () => {
        try {
            await AsyncStorage.removeItem('recents');
            setRecentsList([]);
        } catch (error) {
            console.log(error)
        }
    }

    //Delete specific item & update storage
    const deleteByValue = async (item) => {
        try {
            let recents_without_deleted_value = recents_list.filter( (value) => {
               return value !== item;
            });
            const json_value = JSON.stringify(recents_without_deleted_value);
            await AsyncStorage.setItem('recents', json_value);
            setRecentsList(recents_without_deleted_value);
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        parseRecents();
    }, [recents_list])

    return (
        <View style={styles.container}>
            {/* Recents */}
            {!recents_list.length ? null :
                (<View style={styles.recentsList}>
                    <FlatList
                        ListHeaderComponent={
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                                <Text style={[styles.text, styles.textLg]}>Recent searches </Text>
                                <TouchableOpacity onPress={clearRecents} style={{ alignSelf: "flex-end", flexShrink: 2 }}>
                                    <Text style={{ textDecorationLine: "underline", color: "#735AA2" }}>Clear</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        data={recents_list}
                        renderItem={({ item }) =>
                            <View style={{ display: "flex", flexDirection: "row", alignItems:"center" }}>
                                <Image source={require("../assets/icons/clock.png")} />

                                <Text style={{ padding: 10 }}>{item}</Text>
                                <TouchableOpacity style={{ marginLeft: "auto", alignSelf: "center" }} onPress={() => { deleteByValue(item) }}>
                                    <Text style={{ color: "#735AA2" }}>x</Text>
                                </TouchableOpacity>
                            </View>
                        }
                    />
                </View>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: "100%",
        backgroundColor: "white"
    },

    text: {
        padding: 5,
        flexWrap: "wrap",
        fontFamily: "Open Sans",
        fontWeight: "300",
        fontSize: 10,
        lineHeight: 14,
        letterSpacing: 1,
        textTransform: "capitalize",
        color: "#1D053D"
    },

    textLg: {
        fontSize: 14,
        lineHeight: 24,
        fontWeight: "400"
    },

    link: {
        // fontFamily:"Montserrat",
        padding: 5,
        textAlign: "center",
        fontWeight: "700",
        fontSize: 8,
        lineHeight: 10,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: "#1D053D"
    },

    recentsList: {
        padding: 20,
    }

});

export default Search;

