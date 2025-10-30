import Logo from "./Logo";

export default function Header({ onClear, theme, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="logo">
        <Logo size={64} />
        <div>
          <h1 className="title">ChefGen</h1>
          <div className="sub">AI Recipe Finder — Recipe Generator</div>
        </div>
      </div>
      <div className="controls">
        <label className="switch" title="Toggle theme">
          <input
            type="checkbox"
            checked={theme === "dark"}
            onChange={onToggleTheme}
          />
          <span className="track">
            <span className="thumb"></span>
          </span>
          <span>{theme === "dark" ? "Dark" : "Light"}</span>
        </label>
      </div>
    </header>
  );
}
