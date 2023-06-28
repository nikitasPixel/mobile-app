import React, { useContext, useEffect, useState } from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import AuthProvider from "../context/AuthContext";
import Env from "../context/Env";

import supportedLanguages from "../i18n/supportedLanguages";
import t from "../i18n/i18n"

// navigation
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import VectorImage from 'react-native-vector-image';


// common screens (AppStack)
import RecipesNavigator from "../screens/RecipesNavigator";
import Login from "../screens/Login";
import MyAccount from "../screens/MyAccount";
import CreatePassword from "../screens/CreatePassword";
import ResetPassword from "../screens/ResetPassword";
import ResetLinkSent from "../screens/ResetLinkSent";

// baker screens
import ProductsNavigator from "../screens/ProductsNavigator";
import Cart from "../screens/Cart";


// user (sales rep) screens
import PromoNavigator from "../screens/PromoNavigator";
import ClientsNavigator from "../screens/ClientsNavigator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

//icons
const cartIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/cart.svg")}></VectorImage>
}

const shoppingListIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/shopping_list.svg")}></VectorImage>
}

const myAccountIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/my_account.svg")}></VectorImage>
}

const recipesIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/recipes.svg")}></VectorImage>
}

const promotionsIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/promotions.svg")}></VectorImage>
}

const clientsIcon = (focused, color, size) => {
    return <VectorImage source={require("../assets/icons/clients.svg")}></VectorImage>
}

//navigators for each user type
const AppStack = () => {

    const [prev_login, setPrevLogin] = useState("0");

    useEffect(() => {
        AsyncStorage.getItem(Env.PREV_LOGIN).then(setPrevLogin).catch(console.error);
    }, []);

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen name="Recipes List" component={RecipesNavigator} options={!prev_login ? {
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            } : { tabBarIcon: recipesIcon, tabBarActiveTintColor: "#1D053D" }} />

            <Tab.Screen name="Login" component={Login} options={!prev_login ? {
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            } : { tabBarIcon: myAccountIcon, tabBarActiveTintColor: "#1D053D" }} />
            <Tab.Screen name="CreatePassword" component={CreatePassword} options={{
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            }}
            />
            <Tab.Screen name="ResetPassword" component={ResetPassword} options={{
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            }}
            />
            <Tab.Screen name="ResetLinkSent" component={ResetLinkSent} options={{
                tabBarStyle: {
                    display: "none",
                },
                tabBarButton: () => null,
            }}
            />
        </Tab.Navigator>
    );
};

const BakerStack = () => {
    return (
        <Tab.Navigator initialRouteName={"Products"} screenOptions={{ tabBarActiveTintColor: "#1D053D" }}>
            <Tab.Screen name="MyAccount" component={MyAccount} options={{ headerTitle: t(supportedLanguages.myAccountHeader), headerStyle: { backgroundColor: "#1D053D", }, headerTintColor: "#fff", headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: "bold", }, tabBarLabel: t(supportedLanguages.myAccountHeader), tabBarIcon: myAccountIcon }} />
            <Tab.Screen name="Products" component={ProductsNavigator} options={{ headerShown: false, tabBarLabel: t(supportedLanguages.productsTabbarLabel), tabBarIcon: shoppingListIcon }} />
            <Tab.Screen name="Recipes List" component={RecipesNavigator} options={{ headerShown: false, tabBarLabel: t(supportedLanguages.recipesListHeader), tabBarIcon: recipesIcon }} />
            <Tab.Screen name="Cart" component={Cart} options={{ headerTitle: t(supportedLanguages.cartHeader), headerStyle: { backgroundColor: "#1D053D", }, headerTintColor: "#fff", headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: "bold" }, tabBarLabel: t(supportedLanguages.cartTabbarLabel), tabBarIcon: cartIcon }} />
        </Tab.Navigator>
    );
};

const SalesRepsStack = () => {
    return (
        <Tab.Navigator initialRouteName={"Products"} screenOptions={{ headerShown: false, tabBarActiveTintColor: "#1D053D" }}>
            <Tab.Screen name="Products" component={ProductsNavigator} options={{ headerShown: false, tabBarLabel: t(supportedLanguages.productsTabbarLabel), tabBarIcon: shoppingListIcon }} />
            <Tab.Screen name="Promotions" component={PromoNavigator} options={{ tabBarIcon: promotionsIcon }} />
            <Tab.Screen name="Recipes List" component={RecipesNavigator} options={{ tabBarLabel: t(supportedLanguages.recipesListHeader), tabBarIcon: recipesIcon }} />
            <Tab.Screen name="Clients" component={ClientsNavigator} options={{ tabBarIcon: clientsIcon }} />
            <Tab.Screen name="MyAccount" component={MyAccount} options={{ headerShown: true, headerTitle: t(supportedLanguages.myAccountHeader), headerStyle: { backgroundColor: "#1D053D", }, headerTintColor: "#fff", headerTitleStyle: { fontFamily: "OpenSans-Regular", fontWeight: "bold", }, tabBarLabel: t(supportedLanguages.myAccountHeader), tabBarIcon: myAccountIcon }} />
        </Tab.Navigator>
    );
};

// https://stackoverflow.com/questions/50404239/how-to-store-tokens-in-react-native

const linking = {
    prefixes: ["mzb2b://"],
    config: {
        screens: {
            CreatePassword: "login/:email/:token",
            Login: "login",
        }
    }
}

const Router = () => {

    const { user_data, setUserData } = useContext(AuthProvider);
    // AsyncStorage.getItem(Env.SECURE_DATA_KEY).then(data_string => setUserData(data_string ? JSON.parse(data_string) : Env.DEFAULT_USER_DATA)).catch(console.error);

    useEffect(() => {
        AsyncStorage.getItem(Env.SECURE_DATA_KEY).then(data_string => setUserData(data_string ? JSON.parse(data_string) : Env.DEFAULT_USER_DATA)).catch(console.error);
    }, []);

    return (
        <NavigationContainer linking={linking}>
            {{ guest: <AppStack />, user: <SalesRepsStack />, baker: <BakerStack /> }[user_data.user_type]}
        </NavigationContainer>
    );
}
export default Router;
