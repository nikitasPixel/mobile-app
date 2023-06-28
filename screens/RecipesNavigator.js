import React from "react";

import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RecipesList from "./RecipesList";
import RecipeDetails from "./RecipeDetails";

import supportedLanguages from "../i18n/supportedLanguages";
import t from "../i18n/i18n";

const Stack = createNativeStackNavigator()

const RecipesNavigator = () => {
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
			headerBackTitleVisible: false
		}}>
			<Stack.Screen name="Recipes" component={RecipesList} options={{ headerTitle: t(supportedLanguages.recipesListHeader) }} />
			<Stack.Screen name="RecipeDetails" component={RecipeDetails} options={{ headerTitle: t(supportedLanguages.recipeDetailsHeader) }} />
		</Stack.Navigator>
	);
}

export default RecipesNavigator;