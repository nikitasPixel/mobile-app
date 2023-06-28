import React, { useEffect, useState, useContext } from "react"
import { ScrollView, Text, Image, StyleSheet, View, TouchableOpacity, LogBox, Linking, Share, Alert } from "react-native"
import { FlatList } from "react-native-gesture-handler"
import Big from "big.js"

import PrimaryButton from "../components/buttons/PrimaryButton"
import Accordion from "../components/Accordion"
import Counter from "../components/Counter"

import CartProvider from "../context/CartContext"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Typo, Utils, Lists, Colors } from "../styles"

const ProductDetails = props => {

	//Navigation
	const id = props.route.params.id;

	//Context
	const { cart_items, setCartItems } = useContext(CartProvider);
	const { user_data } = useContext(AuthProvider);
	const { active_baker } = useContext(ActiveBakerProvider);

	//State
	const [is_loading, setLoading] = useState(false);
	const [product, setProduct] = useState([]);
	const [count, setCount] = useState(1);
	const [expandedId, setExpandedId] = useState(null);
	const [total_price, setTotalPrice] = useState(0);

	const dec = (count) => {
		if (count <= 0) {
			return;
		} else {
			setCount(count - 1);
		}
	}

	const name = product ? t(product.name) : "";
	const benefits = product ? product.benefits : [];
	const recipes = product ? product.ingredients?.map((ingr, _i, recipes) => (recipes.every(recipe => recipe?.id == ingr.recipe_fraction.recipe_id) && (ingr.recipe_fraction.recipe.baker_id === user_data.id || !ingr.recipe_fraction.recipe.baker_id)) ? ingr.recipe_fraction.recipe : []) : [];
	const list_items = product ? product.list_items : [];
	const tss_tips = product ? product.tss_tips : [];
	const brochures = product ? product.brochures : [];
	const tech_data = product ? product.tech_data : [];

	let url_params = `api_token=${user_data.token}&baker_remote_id=${(user_data.user_type === "baker") ? user_data.remote_id : active_baker.remote_id}`;

	//Fetch product
	const getProduct = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/products/${id}?${url_params}`)
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
			.then((json) => setProduct(json))
			.catch((error) => console.error(error))
			.finally(() => setLoading(false));
	}
	useEffect(() => {
		setLoading(true);
		getProduct();
		LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
	}, [])

	useEffect(() => {
		const dec_total_price = new Big(product.customer_price ? count * parseFloat((product.customer_price).replace(",", "")) : 0);
		setTotalPrice(dec_total_price.toFixed(2));
	}, [count, product.customer_price])

	//Event listeners
	//TODO: Move to utils
	const onShare = async (url, msg) => {
		try {
			const result = await Share.share({
				url:
					`https://myzeelandia.com/${url}`,
			});
			if (result.action === Share.sharedAction) {
				alert(msg)
			} else if (result.action === Share.dismissedAction) {
				alert(t(supportedLanguages.brochureShareFailMsg))
			}
		} catch (error) {
			alert(error.message);
		}
	};

	const handleAddToCart = (count) => {
		//1.Find the product with the provided id
		const curr_item_index = cart_items.findIndex((item) => item.id === id);

		//2.!exists ? add it to cart_items : increase count
		if (curr_item_index == -1) {
			setCartItems(() => [...cart_items, { name: t(product.name), id: id, count: count, price: product.customer_price, image: product.image, total_price: total_price }]);
			alert(`Added to ${user_data.user_type === "baker" ? "your" : (active_baker.first_name + "'s")} cart`);
		} else {
			const new_item = { ...cart_items[curr_item_index], count: cart_items[curr_item_index].count + count, total_price: (new Big(cart_items[curr_item_index].price)).times(cart_items[curr_item_index].count + count).toFixed(2) };
			//3.Update cart_items array with the updated item
			const new_cart_items = [...cart_items.slice(0, curr_item_index), new_item, ...cart_items.slice(curr_item_index + 1)];
			setCartItems(() => new_cart_items);
			alert(`+${count} ${t(product.name)} added to ${user_data.user_type === "baker" ? "your" : (active_baker.first_name + "'s")} cart`);
		}
	};

	//Product Component
	return (
		<>
			<ScrollView style={styles.container}>
				<Image style={styles.coverImage} source={{ uri: product ? `${Env.SCHEME}://${Env.HOST}/${product.image}?v=${product.updated_at}` : "" }} />
				<Text style={[styles.title, styles.p20, { marginBottom: 14 }]}>{name}</Text>
				<View style={{ display: "flex", flexDirection: "row" }}>
					<Text style={[styles.textBold, { paddingLeft: 20 }]}>{product ? product.customer_price : ""} RON</Text>
					<Text style={styles.text}>{` (${product?.kilo_price || "1.70"} RON/kg) `}</Text>
				</View>
				<Text style={[styles.text, styles.mbottom25, styles.p20]}>{product ? t(product.description) : ""}</Text>
				{/* Benefits */}
				{!benefits?.length
					? null
					: <Accordion
						key={0}
						style={styles.mbottom25}
						title={t(supportedLanguages.benefitsTitle)}
						expanded={expandedId === 0}
						onPress={() => {
							if (expandedId === 0) {
								setExpandedId(null);
							} else {
								setExpandedId(0);
							}
						}}
					>
						<FlatList
							data={benefits}
							renderItem={
								({ item, index }) =>
									<View style={styles.orderedListItem}>
										<View style={styles.orderedListIndexDot}>
											<Text style={styles.orderedListIndex}>{(index + 1)}</Text>
										</View>
										<Text style={[styles.orderedListText, { marginTop: 0, marginBottom: 5 }]}>{t(item.content)}</Text>
									</View>
							}
						/>
					</Accordion>
				}
				{/* Packaging */}
				<Accordion
					key={1}
					style={styles.mbottom25}
					title={t(supportedLanguages.packagingTitle)}
					expanded={expandedId === 1}
					onPress={() => {
						if (expandedId === 1) {
							setExpandedId(null);
						} else {
							setExpandedId(1);
						}
					}}
				>
					<Text style={styles.text}>{product ? t(product.package) : ""}</Text>
				</Accordion>
				{/* Shelf life */}
				<Accordion
					key={2}
					style={styles.mbottom25}
					title={t(supportedLanguages.shelfLifeTitle)}
					expanded={expandedId === 2}
					onPress={() => {
						if (expandedId === 2) {
							setExpandedId(null);
						} else {
							setExpandedId(2);
						}
					}}
				>
					<Text style={styles.text}>{product ? t(product.shelf_life) : ""}</Text>
				</Accordion>
				{/* How to use */}
				<Accordion
					key={3}
					style={styles.mbottom25}
					title={`${t(supportedLanguages.instructionsTitle)} ${name}`}
					expanded={expandedId == 3}
					onPress={() => {
						if (expandedId === 3) {
							setExpandedId(null);
						} else {
							setExpandedId(3);
						}
					}}
				>
					{!list_items?.length ? (<Text style={styles.text}>Ready to use</Text>
					) : (
						<FlatList
							data={list_items}
							keyExtractor={({ id }) => id.toString()}
							renderItem={({ item }) => <Text style={styles.text}>{t(item.content)}</Text>}
						/>
					)}
				</Accordion>
				{/* TSS Tips */}
				{tss_tips?.length == 0 ? null :
					<Accordion
						id={4}
						title={t(supportedLanguages.tssTipsTitle)}
						style={styles.mbottom25}
						expanded={expandedId === 4}
						onPress={() => {
							if (expandedId === 4) {
								setExpandedId(null);
							} else {
								setExpandedId(4);
							}
						}}
					>
						<FlatList
							data={tss_tips}
							renderItem={
								({ item, index }) =>
									<View style={styles.orderedListItem}>
										<View style={styles.orderedListIndexDot}>
											<Text style={styles.orderedListIndex}>{(index + 1)}</Text>
										</View>
										<Text style={[styles.orderedListText, { marginTop: 0, marginBottom: 5 }]}>{t(item.content)}</Text>
									</View>
							}
						/>

					</Accordion>
				}
				{/* Brochures */}
				{brochures?.length == 0 ? null :
					<View style={[styles.mbottom25, styles.p20]}>
						<Text style={[styles.title, styles.mbottom15]}>{t(supportedLanguages.brochuresTitle)}</Text>
						<FlatList
							data={brochures}
							keyExtractor={({ id }) => id.toString()}
							renderItem={({ item }) =>
								<View style={{ display: "flex", flexDirection: "row" }}>
									<View style={{ flexGrow: 2 }}><Text style={[styles.text, styles.linkStyle]}>{t(item.title)}</Text></View>
									<TouchableOpacity onPress={() => Linking.openURL(`${Env.SCHEME}://${Env.HOST}/${item.content}`)}>
										<Image source={require('../assets/icons/download_button.png')} />
									</TouchableOpacity>
									<TouchableOpacity style={{ marginLeft: 25 }} onPress={() => onShare(item.content, t(supportedLanguages.brochureShareSuccessMsg))}>
										<Image source={require('../assets/icons/share_button.png')} />
									</TouchableOpacity>
								</View>}
						/>
					</View>
				}
				{/* Technical data sheet only for the SR */}
				{!(user_data.user_type === "user" && tech_data?.length) ? null :
					<View style={[styles.mbottom25, styles.p20]}>
						<Text style={[styles.title, styles.mbottom15]}>{t(supportedLanguages.techDataSheetTitle)}</Text>
						<FlatList
							data={tech_data}
							keyExtractor={({ id }) => id.toString()}
							renderItem={({ item }) =>
								<View style={{ display: "flex", flexDirection: "row" }}>
									<View style={{ flexGrow: 2 }}><Text style={[styles.text, styles.linkStyle]}>{t(item.title)}</Text></View>
									<TouchableOpacity onPress={() => Linking.openURL(`${Env.SCHEME}://${Env.HOST}/${item.content}`)}>
										<Image source={require('../assets/icons/download_button.png')} />
									</TouchableOpacity>
									<TouchableOpacity style={{ marginLeft: 25 }} onPress={() => onShare(item.content, t(supportedLanguages.technicalDataShareSuccessMsg))}>
										<Image source={require('../assets/icons/share_button.png')} />
									</TouchableOpacity>
								</View>}
						/>
					</View>}
				{/* Related recipes */}
				{recipes?.length == 0
					? null
					: <View style={[styles.mbottom25, styles.p20]}>
						<Text style={styles.title}>{t(supportedLanguages.relatedRecipesTitle)}</Text>
						<FlatList
							data={recipes}
							numColumns={2}
							keyExtractor={({ id }) => id}
							renderItem={
								({ item }) =>
									<TouchableOpacity style={styles.item}
										onPress={() =>
											props.navigation.navigate("RecipeDetails", {
												id: item.id
											})
										}
									>
										<View>
											<Image source={{ uri: `${Env.SCHEME}://${Env.HOST}/${item.image}` }}
												style={{ height: 200 }} />
											<Text style={styles.title}>{t(item.name)}</Text>
										</View>
									</TouchableOpacity>
							}
						/>
					</View>}
			</ScrollView>
			{/* Cart related buttons */}
			{user_data.user_type === "user" && active_baker.id == null ? null :
				<View style={styles.addToCartWrapper}>
					<View style={{ flexDirection: "row" }}>
						<Text style={[styles.textMd]}>{`Total:\n${total_price} RON`}</Text>
						<Counter
							style={{ marginLeft: "auto" }}
							count={count}
							onPressMinus={() => dec(count)}
							onPressPlus={() => setCount(count + 1)}
						/>
					</View>
					<PrimaryButton title={t(supportedLanguages.cartBtn)} style={styles.primaryButton} onPress={() => { handleAddToCart(count) }} />
				</View>}
		</>
	);

}

const styles = StyleSheet.create({
	container: {
		...Utils.container,
	},

	p20: {
		paddingHorizontal: 20
	},

	mbottom25: {
		marginBottom: 25
	},

	mbottom15: {
		marginBottom: 15
	},

	coverImage: {
		width: "80%",
		alignSelf: "center",
		marginTop: 40,
		marginBottom: 20,
		height: 300
	},

	title: {
		textAlign: "left",
		...Typo.textMd,
		fontSize: 20,
		fontWeight: Typo.semiBold,
		color: Colors.aubergine
	},

	text: {
		...Typo.textSm,
		fontWeight: Typo.normal,
		color: Colors.aubergine
	},

	textMd: {
		...Typo.textMd,
		fontWeight: Typo.semiBold,
		color: Colors.aubergine
	},

	textBold: {
		...Typo.textMd,
		fontWeight: Typo.bold,
		color: Colors.aubergine,
		marginBottom: 14
	},

	collapseContainer: {
		...Utils.accordionContainer,
	},

	collapseHeader: {
		...Utils.accordionHeader
	},

	collapseHeaderTitle: {
		...Utils.accordionHeaderTitle
	},

	collapseHeaderIcon: {
		...Utils.accordionHeaderIcon,
	},

	collapseBody: {
		...Utils.accordionBody
	},

	linkStyle: {
		alignSelf: "baseline",
		backgroundColor: "#EFF0EA",
		paddingHorizontal: 10
	},

	tinyLogo: {
		width: 30,
		height: 30,
		marginLeft: 20,
		alignSelf: "center"
	},

	//List items
	orderedListItem: {
		...Lists.orderedListItem
	},

	orderedListText: {
		...Lists.orderedListText
	},

	orderedListIndex: {
		...Lists.orderedListIndex
	},

	orderedListIndexDot: {
		...Lists.orderedListIndexDot
	},

	//Recipes list
	item: {
		width: "45%",
		margin: "2%",
		borderRadius: 8
	},

	addToCartWrapper: {
		backgroundColor: Colors.white,
		paddingHorizontal: 30,
		paddingVertical: 10,
		borderTopWidth: 1,
		borderTopColor: Colors.lightGray
	},

	primaryButton: {
		width: "100%",
		alignItems: "center",
		marginVertical: 10
	}

});

export default ProductDetails;
