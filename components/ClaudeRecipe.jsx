import React from "react"

import ReactMarkdown from "react-markdown"

export default function ClaudeRecipe({ recipe }) {
    return (
        <section>
            <h2>Chef Claude Recommends:</h2>
            <article className="suggested-recipe-container" aria-live="polite">
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </article>
        </section>
    )
}


