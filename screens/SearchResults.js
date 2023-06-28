import React, { useState, useEffect, useContext } from "react";
import { View, StyleSheet, Text, Image, FlatList, TouchableOpacity, Alert } from "react-native";

import AuthProvider from "../context/AuthContext";
import CategoryProvider from "../context/CategoryContext";
import Env from "../context/Env";
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

import t from "../i18n/i18n";

//Empty state
const SearchEmptyState = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/icons/sad-face.png')} />
            <Text style={{ fontSize: 24, color: "#1D053D" }}>No results found</Text>
            <Text style={{ fontSize: 14, color: "#1D053D", marginTop: 10 }}>Try again using a different keyword.</Text>
        </View>
    );
}

//Main component
const SearchResults = (props) => {

    //Navigation
    const search_value = props.route.params.value;

    //Contex
    const { user_data, storeUserData } = useContext(AuthProvider);
    const { current_category } = useContext(CategoryProvider);
    const { setActiveBaker } = useContext(ActiveBakerProvider);
    const { setCartItems } = useContext(CartProvider);

    //State
    const [results, setResults] = useState([]);
    const [cat_id, setCatId] = useState(current_category.id);
    const [is_loading, setIsLoading] = useState(false);

    //Fetch Results
    const getResults = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/search/${cat_id}?term=${search_value}&api_token=${user_data.token}`)
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
                    throw Error("session expired")
                }
            })
            .then((json) => setResults(json))
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false));
    }
    useEffect(() => {
        setIsLoading(true);
        getResults();
    }, [search_value, cat_id]);

    return (
        is_loading ? <Text>Loading...</Text> :
            (results.length ?
                (<View style={styles.container}>
                    {/* Scope bar */}
                    <View style={[styles.scopeBar, styles.shadowProp]}>
                        <Text style={styles.text}>Search in:</Text>
                        <TouchableOpacity style={styles.scopeBarItem} onPress={() => { setCatId("") }}>
                            <Text style={styles.link}>ALL PRODUCTS</Text>
                        </TouchableOpacity>
                        {!current_category?.parent ? null :
                            <TouchableOpacity style={styles.scopeBarItem} onPress={() => { setCatId(current_category.id) }}>
                                <Text style={styles.link}>{current_category?.parent}</Text>
                            </TouchableOpacity>}
                        {!current_category?.name ? null :
                            <TouchableOpacity style={styles.scopeBarItem} onPress={() => { setCatId(current_category.id) }}>
                                <Text style={styles.link}>{current_category?.name}</Text>
                            </TouchableOpacity>}
                    </View>
                    <FlatList
                        data={results}
                        keyExtractor={item => item.id}
                        renderItem={
                            ({ item }) =>
                                <TouchableOpacity style={{ flexDirection: "row", margin: 20 }} onPress={() =>
                                    props.navigation.navigate("Product Details", {
                                        id: item.id
                                    })}>
                                    <Image source={{ uri: `${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}` }}
                                        style={{ height: 81, width: 81, marginRight: 23 }}
                                    />
                                    <View style={{ width: 250 }}>
                                        <Text style={[styles.title]}>{t(item.name)}</Text>
                                        <Text style={[styles.text]}>{t(item.description)}</Text>
                                    </View>
                                </TouchableOpacity>
                        }
                    />
                </View>)
                : <SearchEmptyState />)
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "white",
        overflowX: "hidden"
    },

    scopeBar: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 10,
        borderBottomColor: "#EBEAF0",
        borderBottomWidth: 1
    },

    shadowProp: {
        shadowColor: "#838584",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },

    elevation: {
        elevation: 3.65,
        shadowColor: "#838584",
    },

    text: {
        padding: 5,
        fontFamily: "Open Sans",
        fontWeight: "300",
        fontSize: 10,
        lineHeight: 14,
        letterSpacing: 1,
        textTransform: "capitalize",
        color: "#1D053D"
    },

    scopeBarItem: {
        flexDirection: "row",
        flexShrink: 1,
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center"
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

});

export default SearchResults;

