import React, { useEffect, useState, useContext } from "react"
import { Text, View, StyleSheet, useWindowDimensions, Image, LogBox, FlatList, ScrollView } from "react-native"
import { SliderBox } from "react-native-image-slider-box"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import PrimaryButton from "../components/buttons/PrimaryButton"
import Accordion from "../components/Accordion"

import CartProvider from "../context/CartContext"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Colors, Typo, Utils, Lists } from "../styles"
import Big from "big.js"

const RecipeDetails = props => {

	//Navigation
	const id = props.route.params.id;

	//Context
	const { setCartItems } = useContext(CartProvider);
	const { user_data } = useContext(AuthProvider);
	const { active_baker } = useContext(ActiveBakerProvider);

	//State
	const [is_loading, setLoading] = useState(false);
	const [recipe, setRecipe] = useState({});
	const [expandedId, setExpandedId] = useState(null);
	const [tab_index, setTabIndex] = useState(0);

	const layout = useWindowDimensions();

	//Fetch Recipe
	const getRecipe = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/recipes/${id}`)
			.then(response => response.json())
			.then(json => setRecipe(() => json))
			.catch(error => console.error(error))
			.finally(() => setLoading(false));
	}
	useEffect(() => {
		setLoading(true);
		getRecipe();
		LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
	}, []);

	//Event handlers
	const addZeeProducts = (zee_products) => {
		setCartItems((prevState) => zee_products ? [...(prevState || []), zee_products].reduce((prev, curr) => {
			curr.price = curr.price || curr.customer_price;
			curr.total_price = (new Big(parseFloat(curr.price.replace(",", "")))).times(curr.count).toFixed(2)
			return prev.some(product => product.id == curr.id) ? prev : [curr, ...prev]}, []
		) : prevState)
	};

	const slides = recipe ? (recipe.attachments?.map(e => `${Env.SCHEME}://${Env.HOST}/${e.content}`) ?? []) : []; // :'(
	// const ingredients = recipe ? recipe.ingredients : [];
	const recipe_fractions = recipe ? recipe.recipe_fractions : [];
	const name = recipe ? t(recipe.name) : "";
	//TODO servings

	const Ingredients = () => {
		return (
			<FlatList
				data={recipe_fractions}
				keyExtractor={(item) => `${item.id}_ingr`}
				renderItem={
					({ item }) =>
						<Accordion
							style={styles.accordionContainer}
							title={t(item.title)}
							expanded={expandedId === `${item.id}_ingr`}
							onPress={() =>
								setExpandedId(prevExpanded => {
									if (prevExpanded === `${item.id}_ingr`) {
										return null;
									} else {
										return `${item.id}_ingr`;
									}
								})
							}
						>
							{item.ingredients && (
								<FlatList
									data={item.ingredients}
									keyExtractor={(ingr) => ingr.id}
									renderItem={
										({ item: ingr, index }) =>
											<View style={styles.orderedListItem}>
												<View style={styles.orderedListIndexDot}>
													<Text style={styles.orderedListIndex}>{(index + 1)}</Text>
												</View>
												<Text style={[styles.orderedListText, { marginTop: 0, marginBottom: 5 }]}>{t(ingr.name)}</Text>
											</View>
									}
								/>
							)}
						</Accordion >

				}
			/>
		);
	}

	const Steps = () => {
		return (
			<FlatList
				data={recipe_fractions}
				keyExtractor={(item) => `${item.id}_step`}
				renderItem={
					({ item }) =>
						<Accordion
							style={styles.accordionContainer}
							title={t(item.title)}
							expanded={expandedId === `${item.id}_step`}
							onPress={() =>
								setExpandedId(prevExpanded => {
									if (prevExpanded === `${item.id}_step`) {
										return null;
									} else {
										return `${item.id}_step`;
									}
								})
							}
						>
							{item.list_items && (
								<FlatList
									data={item.list_items}
									keyExtractor={(step) => step.id}
									renderItem={
										({ item: step, index }) =>
											<View style={styles.orderedListItem}>
												<View style={styles.orderedListIndexDot}>
													<Text style={styles.orderedListIndex}>{(index + 1)}</Text>
												</View>
												<Text style={[styles.orderedListText, { marginTop: 0, marginBottom: 5 }]}>{t(step.content)}</Text>
											</View>
									}
								/>
							)}
						</Accordion >

				}
			/>
		);
	}

	//TabView
	const renderScene = SceneMap({
		first: Ingredients,
		second: Steps,
	});

	const renderTabBar = props => (
		<TabBar
			{...props}
			activeColor={Colors.aubergine}
			inactiveColor={Colors.aubergine}
			tabStyle={{ borderRadius: 40 }}
			indicatorStyle={Utils.tabBarIndicator}
			style={Utils.tabBar}
		/>
	);

	const Tabs = () => {
		const [index, _] = useState(tab_index);
		const [routes] = useState([
			{ key: "first", title: t(supportedLanguages.ingredientsTab) },
			{ key: "second", title: t(supportedLanguages.stepsTab) },
		]);

		return (

			<TabView
				style={{ height: 300, marginBottom: 30 }}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				onIndexChange={setTabIndex}
				initialLayout={{ width: 80 }}
			/>
		);
	}

	//Recipe Details Component
	return (
		<ScrollView style={styles.container} nestedScrollEnabled={true}>
			{is_loading ? <Text>Loading...</Text> :
				slides.length ?
					<SliderBox images={slides}
						parentWidth={layout.width}
						sliderBoxHeight={353}
						inactiveDotColor="#CFCFCF"
						dotColor={Colors.royalPurple}
					/>
					: <Image source={{ uri: `${Env.SCHEME}://${Env.HOST}/${recipe.image}?v=${recipe.updated_at}` }}
						style={{ height: 353, width: layout.width }} />}

			<View style={styles.titleContainer}>
				<Text style={styles.title}>{name}</Text>
			</View>
			<Tabs />
			{user_data.user_type !== "baker" && active_baker.id == null ? null : <PrimaryButton title={t(supportedLanguages.orderIngredientsBtn)} style={{ marginBottom: 30 }} onPress={() =>
				recipe_fractions.map(fraction => fraction.ingredients).flat().filter(i => i.products.length).forEach((ingr, i, arr) => {
					addZeeProducts({ count: 1, ...ingr.products[0] });
					i === (arr.length - 1) && alert((`${t(supportedLanguages.addZeeProductsMsg)} ${user_data.user_type === "baker" ? "your" : (active_baker.first_name + "'s")} cart`));
				})
			}
			/>}
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		...Utils.container,
		padding: 0
	},

	coverImage: {
		flex: 1,
		width: "100%"
	},

	titleContainer: {
		alignSelf: "center",
		borderBottomColor: Colors.lightGray,
		borderBottomWidth: 1
	},

	title: {
		...Typo.textMd,
		fontWeight: Typo.semiBold,
		paddingTop: 40,
		paddingBottom: 20,
		textAlign: "center",
		color: Colors.royalPurple
	},

	accordionContainer: {
		marginBottom: 40,
		marginHorizontal: 20
	},

	orderedListItem: {
		...Lists.orderedListItem,
		alignItems: "flex-start"
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

});

export default RecipeDetails;