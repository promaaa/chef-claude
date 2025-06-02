# Chef Claude👨‍🍳

**Chef Claude** is an innovative React web application that uses artificial intelligence to generate personalized recipes based on the ingredients you have on hand. No more wondering what to cook - let Chef Claude inspire you!

## Features

- **AI Recipe Generation**: Use Anthropic's Claude or Mistral AI to create personalized recipes
- **Ingredient Management**: Easily add your available ingredients
- **Markdown Rendering**: Recipes are displayed in a clear and readable format
- **Modern Interface**: Fast and responsive UI built with Vite + React
- **Elegant Design**: Clean user interface with Google Fonts styling

## Technologies Used

- **Frontend**: React 19 (RC), Vite
- **AI**: Anthropic Claude, Hugging Face (Mistral)
- **Styling**: Custom CSS, Google Fonts (Inter)
- **Rendering**: React Markdown

## Prerequisites

Before getting started, make sure you have installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn**
- **API Keys**:
  - Anthropic API Key (for Claude)
  - Hugging Face Access Token (for Mistral)

## Installation and Setup

### 1. Clone the project

```bash
git clone <repository-url>
cd chef-claude
```

### 2. Install dependencies

```bash
npm install
```

### 3. Environment variables setup

Create a `.env` file at the root of the project and add your API keys:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key
HF_ACCESS_TOKEN=your_hugging_face_token
```

### 4. Obtain API keys

#### Anthropic Claude
1. Visit [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Go to "API Keys" and generate a new key
4. Add it to your `.env` file

#### Hugging Face
1. Visit [huggingface.co](https://huggingface.co)
2. Create an account or sign in
3. Go to Settings > Access Tokens
4. Create a new token with read permissions
5. Add it to your `.env` file

## Getting Started

### Development

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production

```bash
# Build the application
npm run build

# Preview the production version
npm run preview
```

## Usage

1. **Start the application** in development mode
2. **Add your ingredients** in the form (e.g., "chicken", "tomatoes", "basil")
3. **Click "Get a recipe"** to generate a recipe
4. **Enjoy your personalized recipe** displayed in markdown format!

## Project Structure

```
chef-claude/
├── public/
│   └── images/
│       └── chef-claude-icon.png
├── src/
│   ├── components/           # React components (to create)
│   │   ├── IngredientsList.jsx
│   │   └── ClaudeRecipe.jsx
│   ├── App.jsx              # Main component
│   ├── Header.jsx           # Header with logo and title
│   ├── Main.jsx             # Main logic and state
│   ├── ai.js                # AI integrations (Claude + Mistral)
│   ├── index.jsx            # React entry point
│   └── index.css            # Global styles
├── index.html               # HTML template
├── package.json             # Dependencies and scripts
├── vite.config.js           # Vite configuration
└── README.md               # This file
```

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run preview`: Preview the production version
- `npm start`: Alias for `npm run dev`

## Security

**IMPORTANT**: This project uses client-side API keys for demonstration purposes. In production:

- **Never** commit your API keys to a repository
- **Never** deploy with exposed client-side API keys
- **Create a backend** to secure API calls
- **Use server-side environment variables**

## Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is under the MIT license. See the `LICENSE` file for more details.

## Acknowledgments

- [Anthropic](https://anthropic.com) for the Claude API
- [Hugging Face](https://huggingface.co) for the Mistral API
- [Scrimba](https://scrimba.com) for project inspiration

---

**Enjoy cooking with Chef Claude!** 🍽️
