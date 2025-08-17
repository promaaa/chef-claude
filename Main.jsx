import React from "react"
import IngredientsList from "./components/IngredientsList"
import ClaudeRecipe from "./components/ClaudeRecipe"
import MistralRecipe from "./components/MistralRecipe"
import { getRecipeFromChefClaude } from "./ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState(
        ["chicken", "all the main spices", "corn", "heavy cream", "pasta"]
    )
    const [recipe, setRecipe] = React.useState("")

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromChefClaude(ingredients)
        setRecipe(recipeMarkdown)
    }

    function handleSubmit(event) {
        event.preventDefault()
        const newIngredient = event.target.elements.ingredient.value
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit">Add ingredient</button>
            </form>

            {ingredients.length > 0 && (
                <>
                    <IngredientsList
                        ingredients={ingredients}
                        getRecipe={getRecipe}
                    />
                    <MistralRecipe ingredients={ingredients} />
                </>
            )}

            {recipe && <ClaudeRecipe recipe={recipe} />}
        </main>
    )
}

