import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack"

import PromosList from "./PromosList"
import ProductDetails from "./ProductDetails"
import RecipeDetails from "./RecipeDetails"
import Cart from "./Cart"

import supportedLanguages from "../i18n/supportedLanguages"
import t from "../i18n/i18n";

const Stack = createNativeStackNavigator()

const PromoNavigator = () => {
	return (
		<Stack.Navigator screenOptions={{
			headerStyle: {
				backgroundColor: "#1D053D",
			},
			headerTintColor: "#fff",
			headerTitleStyle: {
				fontWeight: "bold",
				fontFamily: "OpenSans-Regular",
			},
			headerBackTitleVisible: false
		}}>
			<Stack.Screen name="PromosList" component={PromosList} options={{ headerTitle: t(supportedLanguages.promosListHeader) }} />
			<Stack.Screen name="Product" component={ProductDetails} />
			<Stack.Screen name="RecipeDetails" component={RecipeDetails} />
			<Stack.Screen name="Cart" component={Cart} />
		</Stack.Navigator>
	);
}

export default PromoNavigator;