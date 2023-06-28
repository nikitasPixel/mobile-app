import React, { useContext, useState, useEffect } from "react"
import { Text, View, Image, StyleSheet, FlatList, TouchableOpacity, Alert } from "react-native"
import PrimaryButton from "../components/buttons/PrimaryButton"
import VectorImage from 'react-native-vector-image'
import Counter from "../components/Counter"

import CartProvider from "../context/CartContext"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Utils, Typo, Colors, Lists, Shadow } from "../styles"
import Big from "big.js"

const CartEmptyState = () => {
	const { user_data } = useContext(AuthProvider);
	const { active_baker } = useContext(ActiveBakerProvider);

	return (
		<View style={{ alignItems: "center", marginBottom: "auto" }}>
			<View style={[styles.shadowProp, styles.elevation, styles.emptyStateContainer]}>
				<VectorImage style={{ alignSelf: "center", width: 40, height: 40 }} source={require("../assets/icons/cart.svg")}>
				</VectorImage>
			</View>
			<Text style={styles.emptyStateText}>{user_data.user_type === "baker" ? t(supportedLanguages.cartEmptyStateBaker) : `${active_baker.first_name} ` + t(supportedLanguages.cartEmptyStateSalesRep)}</Text>
		</View>
	);
}

const Cart = props => {
	//Context
	const { cart_items, setCartItems } = useContext(CartProvider);
	const { user_data, storeUserData } = useContext(AuthProvider);
	const { active_baker, setActiveBaker } = useContext(ActiveBakerProvider);

	//State
	const [is_loading, setLoading] = useState(false);
	const [total_price, setTotalPrice] = useState(0);
	const [re_render, setReRender] = useState(false);


	const baker_id = user_data.user_type === "baker" ? user_data.id : active_baker.id;

	//Event handlers
	const setCount = (id, count) => {
		switch (true) {
			case count === 0:
				setCartItems(prevState => prevState.filter(e => e.id !== id))
				break;
			case count > 0:
				setCartItems(prevState => {
					const current_rule = prevState.find(e => e.id === id);
					current_rule.count = count;
					current_rule.total_price = (new Big(parseFloat(current_rule.price.replace(",", "")))).times(count).toFixed(2);
					return prevState;
				})
		}
		setReRender(prevState => !prevState);
	};

	//Fetch Cart
	const getCartItems = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/bakers/${baker_id}/cart`,
			{
				method: "GET",
				headers: {
					"Authorization": `Bearer ${user_data.token}`,
					"Content-Type": "application/json",
					"Accept": "application/json"
				}
			})
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
			.then(cart_data => setCartItems(cart_data?.cart_items?.map((i => { return { ...i.product, count: i.quantity } })) || []))
			.catch(error => console.error(error))
			.finally(() => setLoading(false));
	};

	const postCartItems = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/bakers/${baker_id}/cart`,
			{
				method: "POST",
				headers: {
					"Authorization": `Bearer ${user_data.token}`,
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify(cart_items)
			})
			.then(response => response.json())
			.then(data => { alert(data.message); })
			.catch(error => console.error(error))
			.finally(() => setCartItems([]));
	}

	useEffect(() => {
		if (user_data.user_type !== "baker") {
			setLoading(true);
			getCartItems();
		}
		return;
	}, [baker_id]);

	useEffect(() => {
		const new_total_price = cart_items.reduce((acc, item) => {
			return acc + (parseFloat(item.price.replace(",", "")) * item.count);
		}, 0)
		setTotalPrice((new Big(new_total_price)).toFixed(2));
	}, [cart_items, re_render])

	//Navigation (Preventing going back (SR))
	useEffect(() =>
		props.navigation.addListener("beforeRemove", (e) => {
			if (cart_items.length) {
				e.preventDefault();

				Alert.alert(
					"Discard changes?",
					"You have unsaved changes. Are you sure to discard them and leave the screen?",
					[
						{ text: "Don't leave", style: "cancel", onPress: () => { } },
						{
							text: "Discard",
							style: "destructive",
							onPress: () => { setActiveBaker({ id: null, first_name: "", last_name: "" }); props.navigation.dispatch(e.data.action) },
						},
					]
				);
			} else {
				return;
			}

		}), [cart_items, props.navigation]
	);

	return (
		<View style={styles.container}>
			{is_loading
				? <Text>Loading...</Text>
				: <>
					<TouchableOpacity
						style={styles.backButton}
						onPress={() => props.navigation.navigate("Categories")}>
						<Image
							source={require('../assets/icons/arrow-circle-left.png')}
						/>
						<Text style={styles.backButtonText}>{t(supportedLanguages.backToProductsBtn)}</Text>
					</TouchableOpacity>
					{cart_items.length == 0
						? <CartEmptyState />
						:
						<>
							<Text style={[styles.textMd, { marginBottom: 20 }]}>{user_data.user_type !== "baker" ? `${active_baker.first_name} ${active_baker.last_name} cart` : ""}</Text>
							<FlatList
								data={cart_items}
								extraData={re_render}
								keyExtractor={item => item.id}
								renderItem={
									({ item }) =>
										<View style={styles.cartItemContainer}>
											<Image source={{ uri: `${Env.SCHEME}://${Env.HOST}/${item.image}` }}
												style={styles.cartItemImg} />
											<View style={styles.cartItemInfo}>
												<View style={styles.cartItemInfoTitle}>
													<Text style={styles.textMd}>{t(item.name)}</Text>
													<Text style={[styles.textSm, { marginLeft: "auto" }]}> {item.price} RON</Text>
												</View>
												<Text style={[styles.textSm, { marginLeft: "auto" },]}>{`( ${item?.kilo_price || "1.70"} RON/KG )`}</Text>
												<Counter count={item.count} onPressMinus={() => setCount(item.id, item.count - 1)} onPressPlus={() => setCount(item.id, item.count + 1)} style={{ marginVertical: 10 }} />
												<Text style={styles.textDark}>{item.total_price} RON</Text>
											</View>
										</View>
								}
							/>
							<View style={{ flexDirection: "row", padding: 20 }}>
								<Text style={styles.textMd}>Total</Text>
								<Text style={[styles.textDark, { marginLeft: "auto" }]}>{total_price} RON</Text>
							</View>
						</>
					}
					<PrimaryButton disabled={!cart_items.length} title={user_data.user_type === "baker" ? t(supportedLanguages.submitOrderBtn) : t(supportedLanguages.checkoutOrderBtn)} onPress={postCartItems} />
				</>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		...Utils.container
	},

	backButton: {
		flexDirection: "row",
		justifyContent: "flex-start",
		alignItems: "center",
		marginBottom: 20
	},

	backButtonText: {
		...Typo.textSm,
		fontWeight: Typo.semiBold,
		color: Colors.aubergine,
		textDecorationLine: "underline",
		marginLeft: 4
	},

	emptyStateContainer: {
		backgroundColor: Colors.white,
		width: 96,
		height: 96,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 96,
	},

	shadowProp: {
		...Shadow.shadowProp
	},

	elevation: {
		...Shadow.elevation
	},

	emptyStateText: {
		...Typo.textXs,
		fontWeight: Typo.semiBold,
		color: Colors.aubergine,
		marginTop: 20
	},

	cartItemContainer: {
		flexDirection: "row",
		padding: 14,
		backgroundColor: Colors.white,
		marginBottom: 20,
		borderBottomWidth: 1,
		borderBottomColor: Colors.royalPurple
	},

	cartItemImg: {
		height: 112,
		width: 94,
		borderBottomLeftRadius: 0,
		borderBottomRightRadius: 14,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
	},

	cartItemInfo: {
		flexDirection: "column",
		justifyContent: "space-between",
		marginLeft: 12
	},

	cartItemInfoTitle: {
		display: "flex",
		flexDirection: "row",
		flexWrap: "wrap",
		width: 250
	},

	textMd: {
		...Typo.textMd,
		fontWeight: Typo.normal,
		color: Colors.aubergine
	},

	textSm: {
		...Typo.textSm,
		fontWeight: Typo.light,
		color: Colors.aubergine,
	},

	textDark: {
		...Typo.textMd,
		fontWeight: Typo.extraBold,
		color: Colors.aubergine
	}

});

export default Cart;