import ReactMarkdown from "react-markdown"

export default function ClaudeRecipe({ recipe }) {
    return (
        <section>
            <ReactMarkdown>{recipe}</ReactMarkdown>
        </section>
    )
}
