import React, { useEffect, useState, useContext } from "react"
import { FlatList, Text, View, StyleSheet, Image, Alert } from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"

import CategoryCard from "../components/cards/CategoryCard"

import Env from "../context/Env"
import AuthProvider from "../context/AuthContext"
import ActiveBakerProvider from "../context/ActiveBakerContext"
import CartProvider from "../context/CartContext"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Utils, Typo, Colors, Shadow, Cards } from "../styles"

const PromosList = props => {

	//Context
	const { user_data, storeUserData } = useContext(AuthProvider);
	const { setActiveBaker } = useContext(ActiveBakerProvider);
	const { setCartItems } = useContext(CartProvider);

	//State
	const [promotions, setPromotions] = useState([])

	const getPromos = () => {
		fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/promotions?api_token=${user_data.token}`)
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
					throw Error ("session expired")
				}
			})
			.then(setPromotions)
			.catch((error) => console.error(error))
	}
	useEffect(() => {
		getPromos();
	}, []);

	//*****Tabs******
	const OtherPromos = () => {
		return (
			<>
				<View style={{ backgroundColor: Colors.royalPurple, height: 50, padding: 10 }}>
					<Text style={{ ...Typo.textSm, color: "white", fontWeight: Typo.extraBold }}>This section is under construction.</Text>
					<Text style={{ ...Typo.textSm, color: "white", fontWeight: Typo.extraBold }}>This is just a placeholder.</Text>
				</View>
				<View style={[styles.cardContainer, styles.shadowProp, styles.elevetion]}>
					<Image source={{ uri: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80" }}
						style={{ height: 236, width: "100%", }}
					/>
					<View style={{ flexDirection: "row", alignItems: "center", borderBottomColor: Colors.royalPurple, borderBottomWidth: 1, paddingVertical: 20 }}>
						<Text style={{ ...Typo.textLg, color: Colors.aubergine, }}>Alpina (RO)</Text>
						<Text style={{ marginLeft: "auto", ...Typo.textSm, fontWeight: Typo.semiBold, color: Colors.aubergine }}>11.90€/5kg</Text>
					</View>
					<Text style={{ ...Typo.textMd, color: Colors.aubergine, marginTop: 40 }}>Promotion Label</Text>
				</View>
			</>
		);
	}
	const FocusProducts = () => {
		return (
			<FlatList
				data={promotions[Env.PROMOTION_POM]?.products}
				numColumns={2}
				keyExtractor={({ id }) => id.toString()}
				renderItem={
					({ item }) => (
						<CategoryCard onPress={() =>
							props.navigation.navigate("Product", {
								id: item.id
							})}
							imageUri={`${Env.SCHEME}://${Env.HOST}/${item.image}`}
							name={t(item.name)}
						/>
					)
				}
			/>
		);
	}
	//TODO: Conditional rendering
	const SeasonalPromos = () => {
		return (
			<Text style={styles.text}>{t(supportedLanguages.seasonalPromoEmptyState)}</Text>
		);
	}
	const renderScene = SceneMap({
		first: OtherPromos,
		second: FocusProducts,
		third: SeasonalPromos
	});

	const renderTabBar = props => (
		<TabBar
			{...props}
			activeColor={Colors.aubergine}
			inactiveColor={Colors.aubergine}
			tabStyle={{ borderRadius: 40 }}
			indicatorStyle={Utils.tabBarIndicator}
			style={[Utils.tabBar, { width: 350 }]}
		/>
	);

	const Tabs = () => {
		const [index, setIndex] = useState(0);
		const [routes] = useState([
			{ key: "first", title: t(supportedLanguages.otherPromoTab) },
			{ key: "second", title: t(supportedLanguages.pomTab) },
			// { key: "third", title: t(supportedLanguages.seasonalPromoTab) },
		]);

		return (

			<TabView
				style={{ backgroundColor: "white" }}
				navigationState={{ index, routes }}
				renderScene={renderScene}
				renderTabBar={renderTabBar}
				onIndexChange={setIndex}
				initialLayout={{ width: 800 }}
			/>
		);
	}

	//*****Promotions Component******
	return (
		<View style={styles.container}>
			<Tabs />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		...Utils.container
	},

	text: {
		...Typo.textSm,
		fontWeight: Typo.normal,
		color: Colors.aubergine
	},

	cardContainer: {
		...Cards.cardContainer,
		width: "100%",
		height: 450
	},

	shadowProp: {
		...Shadow.shadowProp,
	},

	elevetion: {
		...Shadow.elevation
	}

});

export default PromosList;