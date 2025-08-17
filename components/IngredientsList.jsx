export default function IngredientsList({ ingredients, getRecipe }) {
    const ingredientElements = ingredients.map(ing => <li key={ing}>{ing}</li>)

    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul>
                {ingredientElements}
            </ul>
            <button onClick={getRecipe}>Get a recipe</button>
        </section>
    )
}
