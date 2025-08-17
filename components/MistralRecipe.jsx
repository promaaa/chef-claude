import React from "react"
import ReactMarkdown from "react-markdown"
import { getRecipeFromMistral } from "../ai"

export default function MistralRecipe({ ingredients }) {
    const [recipe, setRecipe] = React.useState("")

    async function getRecipe() {
        const recipeMarkdown = await getRecipeFromMistral(ingredients)
        if (recipeMarkdown) {
            setRecipe(recipeMarkdown)
        }
    }

    return (
        <section>
            <div className="get-recipe-container">
                <div>
                    <h3>Try Mistral instead</h3>
                    <p>Generate a recipe using the Mistral model.</p>
                </div>
                <button onClick={getRecipe}>Mistral recipe</button>
            </div>
            {recipe && (
                <article className="suggested-recipe-container" aria-live="polite">
                    <ReactMarkdown>{recipe}</ReactMarkdown>
                </article>
            )}
        </section>
    )
}

