import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function MyRecipeScreen() {
    const navigation = useNavigation();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecipes = async () => {
            const storedRecipes = await AsyncStorage.getItem("customrecipes");
            if (storedRecipes) {
                setRecipes(JSON.parse(storedRecipes));
            }
            setLoading(false); // Loading is complete
        };

        fetchRecipes();
    }, []);

    // Callback to refresh the page after adding or editing a recipe
    const handleRecipeUpdated = () => {
        const fetchRecipes = async () => {
            const storedRecipes = await AsyncStorage.getItem("customrecipes");
            if (storedRecipes) {
                setRecipes(JSON.parse(storedRecipes));
            }
        };

        fetchRecipes();
    };

    // Navigate to the RecipesFormScreen with the onrecipeEdited callback
    const handleAddRecipe = () => {
        navigation.navigate("RecipesFormScreen", { onrecipeEdited: handleRecipeUpdated });
    };

    const handleRecipeClick = (recipe) => {
        navigation.navigate("CustomRecipesScreen", { recipe });
    };

    const deleteRecipe = async (index) => {
        try {
            const updatedRecipes = [...recipes];
            updatedRecipes.splice(index, 1);
            await AsyncStorage.setItem("customrecipes", JSON.stringify(updatedRecipes));
            setRecipes(updatedRecipes); // Update state
        } catch (error) {
            console.error("Error deleting the recipe:", error);
        }
    };

    const editRecipe = (recipe, index) => {
        navigation.navigate("RecipesFormScreen", { recipeToEdit: recipe, recipeIndex: index, onrecipeEdited: handleRecipeUpdated });
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Text style={styles.backButtonText}>{"Back"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleAddRecipe} style={styles.addButton}>
                <Text style={styles.addButtonText}>Add New recipe</Text>
            </TouchableOpacity>

            {loading ? (
                <ActivityIndicator size="large" color="#f59e0b" />
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {recipes.length === 0 ? (
                        <Text style={styles.norecipesText}>No recipes added yet.</Text>
                    ) : (
                        recipes.map((recipe, index) => (
                            <View key={index} style={styles.recipeCard} testID="recipeCard">
                                <TouchableOpacity testID="handleRecipeBtn" onPress={() => handleRecipeClick(recipe)}>
                                    {recipe.image && (
                                        <Image
                                            source={{ uri: recipe.image }}
                                            style={styles.recipeImage}
                                        />
                                    )}
                                    <Text style={styles.recipeTitle}>{recipe.title}</Text>
                                    <Text style={styles.recipeDescription} testID="recipeDescp">
                                        {recipe.description?.substring(0, 50) + "..."}
                                    </Text>
                                </TouchableOpacity>

                                {/* Edit and Delete Buttons */}
                                <View style={styles.actionButtonsContainer} testID="editDeleteButtons">
                                    <TouchableOpacity onPress={() => editRecipe(recipe, index)} style={styles.editButton}>
                                        <Text style={styles.editButtonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => deleteRecipe(index)} style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))
                    )}
                </ScrollView>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: wp(4),
        backgroundColor: "#F9FAFB",
    },
    backButton: {
        marginBottom: hp(1),
    },
    backButtonText: {
        fontSize: hp(2),
        color: "#4F75FF",
    },
    addButton: {
        backgroundColor: "#4F75FF",
        padding: wp(3),
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        width: wp(80),
        marginTop: hp(2),
    },
    addButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: hp(2),
    },
    scrollContainer: {
        paddingBottom: hp(2),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    norecipesText: {
        textAlign: "center",
        fontSize: hp(2),
        color: "#6B7280",
        marginTop: hp(5),
    },
    recipeCard: {
        width: wp(85),
        height: hp(30),
        backgroundColor: "#fff",
        padding: wp(3),
        borderRadius: 8,
        marginBottom: hp(2),
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    recipeImage: {
        width: wp(80),
        height: hp(15),
        borderRadius: 8,
        marginBottom: hp(1),
    },
    recipeTitle: {
        fontSize: hp(2),
        fontWeight: "600",
        color: "#111827",
        marginBottom: hp(0.5),
    },
    recipeDescription: {
        fontSize: hp(1.8),
        color: "#6B7280",
        marginBottom: hp(1.5),
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: hp(1),
    },
    editButton: {
        backgroundColor: "#34D399",
        padding: wp(1),
        borderRadius: 5,
        width: wp(25),
        alignItems: "center",
    },
    editButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: hp(1.8),
    },
    deleteButton: {
        backgroundColor: "#EF4444",
        padding: wp(1),
        borderRadius: 5,
        width: wp(25),
        alignItems: "center",
    },
    deleteButtonText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: hp(1.8),
    },
});
