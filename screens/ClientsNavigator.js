import React from "react"
import { createNativeStackNavigator } from "@react-navigation/native-stack"

import ClientsList from "./ClientsList"
import ClientDetails from "./ClientDetails"
import Cart from "./Cart"

import supportedLanguages from "../i18n/supportedLanguages"
import t from "../i18n/i18n";

const Stack = createNativeStackNavigator()

const ClientsNavigator = () => {
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
			<Stack.Screen name="ClientsList" component={ClientsList} options={{ headerTitle: t(supportedLanguages.clientsListHeader) }} />
			<Stack.Screen name="ClientDetails" component={ClientDetails} options={{ headerTitle: t(supportedLanguages.clientDetailsHeader) }} />
			<Stack.Screen name="Cart" component={Cart} options={{ headerLeft: () => <></>}}/>
		</Stack.Navigator>
	);
}

export default ClientsNavigator;