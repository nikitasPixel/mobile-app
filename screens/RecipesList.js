import React, { useEffect, useState, useContext } from "react"
import { View, Text, FlatList, StyleSheet } from "react-native"
import { TabView, SceneMap, TabBar } from "react-native-tab-view"
import RecipeCard from "../components/cards/RecipeCard"

import AuthProvider from "../context/AuthContext"
import Env from "../context/Env"

import t from "../i18n/i18n"
import supportedLanguages from "../i18n/supportedLanguages"
import { Utils, Typo, Colors } from "../styles"

const RecipesList = props => {

    //Context
    const { user_data } = useContext(AuthProvider);

    //State
    const [is_loading, setLoading] = useState(false);
    const [recipes, setRecipes] = useState([]);

    //Fetch Recipes
    const getRecipes = () => {
        fetch(`${Env.SCHEME}://${Env.HOST}/${Env.API_PATH}/recipes`)
            .then((response) => response.json())
            .then((json) => setRecipes(json))
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    useEffect(() => {
        setLoading(true);
        getRecipes();
    }, []);

    //---------------------Baker Tabs: my recipes & all recipes---------------------
    const MyRecipes = () => {
        return (
            <>
                {recipes.filter(e => e.baker_id === user_data.id).length ? null : <Text style={styles.title}>{t(supportedLanguages.myRecipesTabEmptyState)}</Text>}
                <FlatList
                    data={recipes.filter(e => e.baker_id === user_data.id)}
                    numColumns={2}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={
                        ({ item }) =>
                            <RecipeCard
                                onPress={() =>
                                    props.navigation.navigate("RecipeDetails", {
                                        id: item.id
                                    })
                                }
                                imageUri={`${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}`}
                                name={t(item.name)}
                            />
                    }
                />
            </>
        );
    }

    const AllRecipes = () => {
        return (
            <FlatList
                data={recipes.filter(e => e.baker_id === null)}
                numColumns={2}
                keyExtractor={({ id }) => id.toString()}
                renderItem={
                    ({ item }) =>
                        <RecipeCard
                            onPress={() =>
                                props.navigation.navigate("RecipeDetails", {
                                    id: item.id
                                })
                            }
                            imageUri={`${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}`}
                            name={t(item.name)}
                        />
                }
            />
        );
    }

    //---------------------Tabs component---------------------
    const renderScene = SceneMap({
        first: AllRecipes,
        second: MyRecipes,
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
        const [index, setIndex] = useState(0);
        const [routes] = useState([
            { key: "first", title: t(supportedLanguages.allRecipesTab) },
            { key: "second", title: t(supportedLanguages.myRecipesTab) },
        ]);

        return (

            <TabView
                style={{ backgroundColor: Colors.white }}
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: 800 }}
            />
        );
    }

    return (
        <View style={styles.container}>
            {user_data.user_type !== "baker" ?
                <FlatList
                    data={recipes.filter(e => e.baker_id === null)}
                    numColumns={2}
                    keyExtractor={({ id }) => id.toString()}
                    renderItem={
                        ({ item }) =>
                            <RecipeCard
                                onPress={() =>
                                    props.navigation.navigate("RecipeDetails", {
                                        id: item.id
                                    })
                                }
                                imageUri={`${Env.SCHEME}://${Env.HOST}/${item.image}?v=${item.updated_at}`}
                                name={t(item.name)}
                            />
                    }
                />
                : <Tabs />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...Utils.container
    },

    title: {
        ...Typo.textXs,
        fontWeight: Typo.semiBold,
        color: Colors.aubergine
    },

});

export default RecipesList;