import React from "react"
import Header from "./Header"
import Main from "./Main"

export default function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('theme') || 'dark')

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const resetEvent = new Event('chef-reset')
  function handleClear() {
    window.dispatchEvent(resetEvent)
  }

  function onToggleTheme() {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Header onClear={handleClear} theme={theme} onToggleTheme={onToggleTheme} />
      <Main />
    </>
  )
}
