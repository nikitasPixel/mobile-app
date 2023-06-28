import React, { useEffect, useState, useContext } from "react"
import { FlatList, Text, View, StyleSheet, Alert } from "react-native"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

import CategoryCard from "../components/cards/CategoryCard"
import t from "../i18n/i18n"
import { Utils } from "../styles"

const Subcategories = props => {

    //Navigation
    const product_category = props.route.params.id;

    //Context
    const { user_data, storeUserData } = useContext(AuthProvider);
    const { setActiveBaker } = useContext(ActiveBakerProvider)
    const { setCartItems } = useContext(CartProvider)

    //State
    const [is_loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    const getCategories = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/categories/${product_category}/categories?api_token=${user_data.token}`)
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
            .then(json => setCategories(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        setLoading(true);
        getCategories();
    }, []);

    return (
        <View style={styles.container}>
            {is_loading ? <Text>Loading...</Text> :
                (
                    <>
                        <FlatList
                            data={categories}
                            numColumns={2}
                            keyExtractor={({ id }) => id.toString()}
                            renderItem={
                                ({ item }) =>
                                    <CategoryCard onPress={() =>
                                        props.navigation.navigate("Products List", {
                                            id: item.id
                                        })}
                                        imageUri={item.id != "-1" ? `${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}` : item.image}
                                        name={t(item.name)}
                                    />
                            }
                        />
                    </>
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...Utils.container
    },

});

export default Subcategories;