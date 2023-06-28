import React, { useState } from "react"
import { View, StyleSheet, TextInput, Text, Image, TouchableOpacity } from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage"

import { useNavigation } from "@react-navigation/native"

import { Colors, Typo, Forms, } from "../styles"

const SearchBar = () => {

	const [search_value, setSearchValue] = useState("");
	const navigation = useNavigation();

	//AsyncStorage Add value to recents list
	const addToRecents = async (current) => {
		try {
			let recents = await AsyncStorage.getItem('recents') || '[]';
			recents = JSON.parse(recents);
			recents.push(current);
			AsyncStorage.setItem('recents', JSON.stringify(recents)).then(() => {
				console.log("Recents updated.")
			});
		} catch (error) {
			console.log(error)
		}
	};

	return (
		<View>
			<View style={styles.textInput}>
				<Image source={require('../assets/icons/search-icon-dark.png')} style={{ alignSelf: "center" }} />
				<TextInput
					placeholder="Description, Ingredients and more"
					value={search_value}
					onChangeText={setSearchValue}
					onSubmitEditing={() => {
						navigation.navigate("Search Results", { value: search_value });
						addToRecents(search_value);
						setSearchValue("");
					}
					}
				/>
				<TouchableOpacity style={styles.textInputIconContainer} onPress={() => setSearchValue("")}>
					<Text style={styles.textInputIcon}>x</Text>
				</TouchableOpacity>
			</View>
		</View>

	);
}

const styles = StyleSheet.create({
	textInputIconContainer: {
		...Forms.textInputIconContainer
	},

	textInput: {
		...Forms.textInput,
		padding: 0,
		paddingHorizontal: 5,
	},

	textInputIcon: {
		...Forms.textInputIcon,
		marginEnd: 10
	},

	text: {
		...Typo.textXs,
		fontWeight: Typo.normal,
		color: Colors.aubergine,
	}

});

export default SearchBar;
