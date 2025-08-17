import React from "react"

export default function IngredientsList({ ingredients, getRecipe }) {
    const ingredientElements = ingredients.map(ingredient => (
        <li key={ingredient}>{ingredient}</li>
    ))


    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list">
                {ingredientElements}
            </ul>
            <div className="get-recipe-container">
                <div>
                    <h3>Ready for a recipe?</h3>
                    <p>Generate a recipe with your ingredients.</p>
                </div>
                <button onClick={getRecipe}>Get a recipe</button>
            </div>
        </section>
    )
}

