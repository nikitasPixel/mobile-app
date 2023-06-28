import React from "react";
import { TouchableOpacity, Image } from "react-native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ProductsList from "./ProductsList";
import ProductDetails from "./ProductDetails";
import Categories from "./Categories";
import Subcategories from "./Subcategories";
import RecipeDetails from "./RecipeDetails";
import Search from "./Search";
import SearchResults from "./SearchResults";

import SearchBar from "../components/SearchBar";

import supportedLanguages from "../i18n/supportedLanguages";
import t from "../i18n/i18n";

const Stack = createNativeStackNavigator()

const ProductsNavigator = (props) => {
	return (
		<Stack.Navigator screenOptions={{
			headerStyle: {
				backgroundColor: "#1D053D",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				fontFamily: "OpenSans-Regular",
				fontWeight: "bold",
			},
			headerBackTitleVisible: false,
			headerRight: () => (
				<TouchableOpacity onPress={() => props.navigation.navigate("Search")}>
					<Image source={require('../assets/icons/search.png')} />
				</TouchableOpacity>
			),
		}}>
			<Stack.Screen name="Categories" component={Categories} options={{ headerTitle: t(supportedLanguages.productCategoriesHeader) }} />
			<Stack.Screen name="Subcategories" component={Subcategories} options={{ headerTitle: t(supportedLanguages.productCategoriesHeader) }} />
			<Stack.Screen name="Products List" component={ProductsList} options={{ headerTitle: t(supportedLanguages.productsListsHeader) }} />
			<Stack.Screen name="Product Details" component={ProductDetails} options={{ headerTitle: t(supportedLanguages.productDetailsHeader) }} />
			<Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ headerTitle: t(supportedLanguages.recipeDetailsHeader) }} />
			<Stack.Screen name="Search" component={Search} options={{ headerShown: true, headerTitle: () => (<SearchBar />), tabBarItemStyle: { display: "none" } }} />
			<Stack.Screen name="Search Results" component={SearchResults} options={{ headerShown: true, headerTitle: () => (<SearchBar />), tabBarItemStyle: { display: "none" } }} />
		</Stack.Navigator>
	);
}

export default ProductsNavigator;