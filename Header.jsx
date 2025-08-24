import Logo from './Logo'

export default function Header({ onClear, theme, onToggleTheme }) {
    return (
        <header className="app-header">
            <div className="logo">
                <Logo size={34} />
                <div>
                    <h1 className="title">ChefGen</h1>
                    <div className="sub">AI Recipe Finder — Recipe Generator</div>
                </div>
            </div>
            <div className="controls">
                <label className="switch" title="Toggle theme">
                    <input type="checkbox" checked={theme === 'dark'} onChange={onToggleTheme} />
                    <span className="track"><span className="thumb"></span></span>
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                </label>
                <button className="btn ghost" onClick={() => window.dispatchEvent(new Event('chef-about'))}>About</button>
                <button className="btn ghost" onClick={onClear}>Clear</button>
            </div>
        </header>
    )
}
