import React, { useEffect, useState, useContext } from "react"
import { FlatList, Text, View, StyleSheet, Alert } from "react-native"
import Big from "big.js"

import ProductCard from "../components/cards/ProductCard"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import CartProvider from "../context/CartContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"

import t from "../i18n/i18n"
import { Utils } from "../styles"

const ProductsList = props => {

	//Navigation
	const id = props.route.params.id;

	//Context
	const { user_data, storeUserData } = useContext(AuthProvider);
	const { active_baker, setActiveBaker } = useContext(ActiveBakerProvider);
	const { cart_items, setCartItems } = useContext(CartProvider);

	//State
	const [is_loading, setLoading] = useState(false);
	const [products, setProducts] = useState([]);

	//Event listeners
	const handleAddToCart = (product) => {
		//1.Find the product with the provided id
		const curr_item_index = cart_items.findIndex((item) => item.id === product.id);

		//2.!exists ? add it to cart_items : increase count
		if (curr_item_index == -1) {
			setCartItems([...cart_items, { name: t(product.name), id: product.id, count: 1, price: product.customer_price, image: product.image, total_price: product.customer_price }]);
			alert(`Added to ${user_data.user_type === "baker" ? "your" : (active_baker.first_name + "'s")} cart`);
		} else {
			const new_item = { ...cart_items[curr_item_index], count: cart_items[curr_item_index].count + 1, total_price: (new Big(cart_items[curr_item_index].count + 1) * (cart_items[curr_item_index].price)).toFixed(2) };
			//3.Update cart_items array with the updated item
			const new_cart_items = [...cart_items.slice(0, curr_item_index), new_item, ...cart_items.slice(curr_item_index + 1)];
			setCartItems(new_cart_items);
			alert(`+1 ${t(product.name)} added to ${user_data.user_type === "baker" ? "your" : (active_baker.first_name + "'s")} cart`);
		}
	};

	let url_params = `api_token=${user_data.token}&baker_remote_id=${(user_data.user_type === "baker") ? user_data.remote_id : active_baker.remote_id}`;

	//Fetch Products
	const getProducts = () => {
		fetch(id == -1 ? (`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/products/new?${url_params}`) : (`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/categories/${id}/products?${url_params}`))
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
			.then((json) => setProducts(json))
			.catch((error) => console.error(error))
			.finally(() => setLoading(false));
	}
	useEffect(() => {
		setLoading(true);
		getProducts();
	}, []);

	return (
		<View style={styles.container}>
			{is_loading ? <Text>Loading...</Text> :
				(
					<FlatList
						data={products}
						numColumns={2}
						keyExtractor={({ id }) => id.toString()}
						renderItem={
							({ item }) =>
								<ProductCard onPress={() =>
									props.navigation.navigate("Product Details", {
										id: item.id
									})}
									imageUri={`${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}`}
									name={t(item.name)}
									price={item.customer_price}
									kilo_price={item.kilo_price}
									onPressPlus={() => { handleAddToCart(item) }}
								/>
						}
					/>
				)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...Utils.container
	},
});

export default ProductsList;