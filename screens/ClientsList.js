import React, { useEffect, useState, useContext } from "react"
import { View, Text, FlatList, StyleSheet, Alert } from "react-native"

import ClientCard from "../components/cards/ClientCard"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

const ClientsList = props => {

    //Context
    const { user_data, storeUserData } = useContext(AuthProvider);
    const { setActiveBaker } = useContext(ActiveBakerProvider);
    const { setCartItems } = useContext(CartProvider)

    //State
    const [is_loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);

    const getClients = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/bakers?api_token=${user_data.token}`)
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
            .then(setClients)
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        setLoading(true);
        getClients();
    }, []);

    return (
        <View style={styles.container}>
            {is_loading ? <Text>Loading</Text> :
                (
                    <FlatList
                        data={clients}
                        keyExtractor={({ id }) => id.toString()}
                        renderItem={
                            ({ item }) =>
                                <ClientCard first_name={item.first_name} last_name={item.last_name} pending={item.has_pending_cart} onPress={() =>
                                    props.navigation.navigate("ClientDetails", {
                                        id: item.id
                                    })
                                } />
                        }
                    />
                )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFFFFF",
        padding: 20,
        width: "100%",
        height: "100%"
    },

});

export default ClientsList;