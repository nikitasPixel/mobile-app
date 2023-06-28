import React, { useEffect, useState, useContext } from "react"
import { FlatList, Text, View, StyleSheet, Image, Alert } from "react-native"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import CategoryProvider from "../context/CategoryContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

import CategoryCard from "../components/cards/CategoryCard"
import t from "../i18n/i18n"
import { Utils } from "../styles"

import newProductsImage from "../assets/bxs_megaphone.png"
const newProductsImageUri = Image.resolveAssetSource(newProductsImage).uri

const Categories = props => {

    //Context
    const { user_data, storeUserData } = useContext(AuthProvider);
    const { setCurrentCategory } = useContext(CategoryProvider);
    const { setActiveBaker } = useContext(ActiveBakerProvider)
    const { setCartItems } = useContext(CartProvider)

    //State
    const [is_loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([{ name: "New Products", image: newProductsImageUri, id: -1, type: "LEAF" }]);

    const getCategories = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/categories/root?api_token=${user_data.token}`)
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
            .then(json => setCategories(prevState => [...prevState, ...json]))
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
                                        item.type === "LEAF" ?
                                            [props.navigation.navigate("Products List", { id: item.id }), setCurrentCategory({ name: t(item.name), id: item.id })]
                                            : [props.navigation.navigate("Subcategories", { id: item.id }), setCurrentCategory({ name: t(item.name), id: item.id, parent: item.category_name })]
                                    }
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

export default Categories;