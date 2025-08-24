import React from "react"

const MODELS = {
  openai: [
    { id: 'gpt-4o-mini', label: 'GPT-4o mini (cheap & fast)' },
    { id: 'gpt-4o', label: 'GPT-4o (quality)' },
    { id: 'gpt-4.1-mini', label: 'GPT-4.1 mini' }
  ],
  mistral: [
    { id: 'mistral-small-latest', label: 'Mistral Small (speed)' },
    { id: 'mistral-medium-latest', label: 'Mistral Medium' },
    { id: 'mistral-large-latest', label: 'Mistral Large (best)' }
  ],
  gemini: [
    { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash (speed)' },
    { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro (quality)' },
    { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B (cheap)' }
  ],
  mock: [{ id: 'demo-recipe', label: 'Demo recipe' }]
}
const PRESET_TEMP = { speed: 0.2, balanced: 0.7, quality: 1.0 }

const SYSTEM_PROMPT = `You are a precise recipe generator. Output STRICT JSON ONLY, no prose.
Schema:
{
  "title": string,
  "servings": number,
  "ready_in_minutes": number,
  "cuisine": string,
  "difficulty": "Easy" | "Intermediate" | "Advanced",
  "ingredients": [{"item": string, "quantity": string, "optional": boolean}],
  "steps": [string, ...],
  "notes": [string, ...],
  "nutrition": {"calories": string, "protein": string, "carbs": string, "fat": string}
}
Rules:
- Use ONLY ingredients provided unless marked optional; you may infer pantry staples (salt, pepper, oil).
- Keep steps concise and numbered, each an actionable sentence.
- Match servings, cuisine and skill if given; respect dietary preferences strictly.
- If time limit given, ensure ready_in_minutes <= limit.
- If missing data, make reasonable assumptions and continue.`

function extractJSON(text) {
  if (!text) throw new Error('Empty response')
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i)
  const raw = match ? match[1] : text
  const first = raw.indexOf('{'); const last = raw.lastIndexOf('}')
  const candidate = (first >= 0 && last > first) ? raw.slice(first, last + 1) : raw
  return JSON.parse(candidate)
}

function callOpenAI(key, model, userPrompt, temperature) {
  const url = 'https://api.openai.com/v1/chat/completions'
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: Number(temperature),
    response_format: { type: 'json_object' }
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  }).then(async r => {
    if (!r.ok) throw new Error(`OpenAI ${r.status}: ${await r.text()}`)
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim()
  })
}

function callMistral(key, model, userPrompt, temperature) {
  const url = 'https://api.mistral.ai/v1/chat/completions'
  const body = {
    model,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt }
    ],
    temperature: Number(temperature)
  }
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  }).then(async r => {
    if (!r.ok) throw new Error(`Mistral ${r.status}: ${await r.text()}`)
    const j = await r.json();
    return j.choices?.[0]?.message?.content?.trim()
  })
}

function callGemini(key, model, userPrompt, temperature) {
  const url = `https://generativelanguage.googleapis.com/v1/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\n" + userPrompt }]}],
    generationConfig: { temperature: Number(temperature), responseMimeType: 'application/json' }
  }
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(async r => {
    if (!r.ok) throw new Error(`Gemini ${r.status}: ${await r.text()}`)
    const j = await r.json();
    const text = j.candidates?.[0]?.content?.parts?.map(p => p.text).join('').trim()
    return text
  })
}

function callMock(servings = 2) {
  return JSON.stringify({
    title: 'Creamy Lemon Garlic Pasta',
    servings: Number(servings) || 2,
    ready_in_minutes: 18,
    cuisine: 'Italian',
    difficulty: 'Easy',
    ingredients: [
      { item: 'spaghetti', quantity: '200 g', optional: false },
      { item: 'garlic', quantity: '3 cloves, minced', optional: false },
      { item: 'lemon', quantity: '1 (zest + juice)', optional: false },
      { item: 'olive oil', quantity: '2 tbsp', optional: false },
      { item: 'parmesan', quantity: '40 g, grated', optional: true },
      { item: 'salt & pepper', quantity: 'to taste', optional: true }
    ],
    steps: [
      'Boil salted water and cook pasta until al dente; reserve 1/2 cup pasta water.',
      'Warm olive oil in a pan; sauté garlic 30–45 seconds until fragrant.',
      'Add lemon zest and 1/4 cup pasta water; swirl to emulsify.',
      'Toss in pasta and lemon juice; add more pasta water for a silky sauce.',
      'Off heat, fold in parmesan (if using); season and serve immediately.'
    ],
    notes: ['Add spinach or peas for greens.', 'Top with chili flakes for heat.'],
    nutrition: { calories: '520 kcal', protein: '18 g', carbs: '78 g', fat: '16 g' }
  }, null, 2)
}

export default function Main() {
  const [provider, setProvider] = React.useState(() => localStorage.getItem('chefgen.provider') || 'openai')
  const [model, setModel] = React.useState('')
  const [modelCustom, setModelCustom] = React.useState('')
  const [apiKey, setApiKey] = React.useState('')
  const [showKey, setShowKey] = React.useState(false)
  const [temperature, setTemperature] = React.useState(0.7)
  const [maxTime, setMaxTime] = React.useState('')
  const [preset, setPreset] = React.useState('balanced')

  const [ingredients, setIngredients] = React.useState([])
  const [input, setInput] = React.useState('')
  const [servings, setServings] = React.useState(2)
  const [skill, setSkill] = React.useState('Easy')
  const [cuisine, setCuisine] = React.useState('')
  const [prefs, setPrefs] = React.useState(new Set())

  const [status, setStatus] = React.useState('Ready.')
  const [warn, setWarn] = React.useState('')
  const [recipe, setRecipe] = React.useState(null)
  const [aboutOpen, setAboutOpen] = React.useState(false)
  const [toast, setToast] = React.useState('')

  function showToast(msg = 'Copied!') {
    setToast(msg)
    setTimeout(() => setToast(''), 1500)
  }

  function populateFromProvider(p) {
    const savedModel = localStorage.getItem(`chefgen.model.${p}`)
    if (savedModel && savedModel !== '__custom__') {
      // If saved model is in curated list, set as model
      const list = MODELS[p]?.map(m => m.id) || []
      if (list.includes(savedModel)) {
        setModel(savedModel)
        setModelCustom('')
      } else {
        setModel('__custom__'); setModelCustom(savedModel)
      }
    } else {
      // default to first model
      const first = MODELS[p]?.[0]?.id || ''
      setModel(first)
      setModelCustom('')
    }
    setApiKey(localStorage.getItem(`chefgen.key.${p}`) || '')
  }

  React.useEffect(() => { populateFromProvider(provider) }, [provider])

  function handleSetProvider(p) {
    setProvider(p)
    localStorage.setItem('chefgen.provider', p)
  }

  function handleModelChange(v) {
    setModel(v)
    if (v === '__custom__') {
      // keep custom visible
    } else {
      setModelCustom('')
      localStorage.setItem(`chefgen.model.${provider}`, v)
    }
  }

  function handleCustomModelChange(v) {
    setModelCustom(v)
    localStorage.setItem(`chefgen.model.${provider}`, v.trim())
  }

  function handlePreset(name) {
    setPreset(name)
    setTemperature(PRESET_TEMP[name] ?? 0.7)
    const list = MODELS[provider] || []
    if (list.length) {
      let idx = 0
      if (name === 'balanced') idx = Math.min(1, list.length - 1)
      if (name === 'quality') idx = list.length - 1
      handleModelChange(list[idx].id)
    }
  }

  function addMany(raw) {
    const parts = raw.split(/[,\n]/).map(s => s.trim()).filter(Boolean)
    if (!parts.length) return
    setIngredients(prev => {
      const next = new Set(prev)
      parts.forEach(p => next.add(p))
      return Array.from(next)
    })
  }

  function onKeyDown(e) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); addMany(input); setInput('')
    }
  }

  function removeIngredient(i) { setIngredients(prev => prev.filter(x => x !== i)) }

  function togglePref(k) {
    setPrefs(prev => {
      const n = new Set(prev); n.has(k) ? n.delete(k) : n.add(k); return n
    })
  }

  function buildUserPrompt() {
    const parts = []
    parts.push(`Ingredients: ${ingredients.join(', ') || '—'}`)
    parts.push(`Servings: ${servings || 2}`)
    if (cuisine) parts.push(`Cuisine: ${cuisine}`)
    parts.push(`Skill: ${skill}`)
    const arr = Array.from(prefs)
    if (arr.length) parts.push(`Dietary: ${arr.join(', ')}`)
    if (maxTime) parts.push(`Max time: ${maxTime} minutes`)
    parts.push('Return strict JSON per schema. No backticks.')
    return parts.join('\n')
  }

  async function generate() {
    setWarn('')
    if (!ingredients.length && provider !== 'mock') {
      setWarn('Add at least one ingredient (or switch to Demo).'); return
    }
    const m = model === '__custom__' ? (modelCustom || '').trim() : model
    if (provider !== 'mock' && !apiKey.trim()) { setWarn('Missing API key.'); return }
    if (!m) { setWarn('Please set a model.'); return }

    const userPrompt = buildUserPrompt()
    setStatus('Thinking…')
    try {
      let raw
      if (provider === 'openai') raw = await callOpenAI(apiKey.trim(), m, userPrompt, temperature)
      else if (provider === 'mistral') raw = await callMistral(apiKey.trim(), m, userPrompt, temperature)
      else if (provider === 'gemini') raw = await callGemini(apiKey.trim(), m, userPrompt, temperature)
      else raw = callMock(servings)
      const json = extractJSON(raw)
      setRecipe(json)
      setStatus('Done.')
      window.__lastRecipe = json
    } catch (err) {
      console.error(err)
      setStatus('Error.')
      setWarn(err.message)
    }
  }

  function surprise() {
    const kits = [
      ['eggs','rice','spring onion','soy sauce','sesame oil'],
      ['chicken','yogurt','garlic','lemon','paprika'],
      ['tuna','pasta','tomatoes','olives','capers'],
      ['tofu','broccoli','ginger','garlic','soy sauce'],
      ['chickpeas','spinach','cumin','onion','tomato']
    ]
    const pick = kits[Math.floor(Math.random() * kits.length)]
    setIngredients(pick)
    generate()
  }

  function copyRender() {
    if (!recipe) return
    const chips = []
    if (recipe.cuisine) chips.push(recipe.cuisine)
    if (recipe.difficulty) chips.push(recipe.difficulty)
    if (recipe.servings) chips.push(`${recipe.servings} servings`)
    if (recipe.ready_in_minutes) chips.push(`${recipe.ready_in_minutes} min`)
    const txt = `
${recipe.title || 'Untitled recipe'}
${chips.join(' • ')}

Ingredients:
${(recipe.ingredients||[]).map(i=>'- '+`${i.quantity?i.quantity+' ':''}${i.item}${i.optional?' (optional)':''}`).join('\n')}

Steps:
${(recipe.steps||[]).map((s,i)=> (i+1)+'. '+s).join('\n')}

${(recipe.notes&&recipe.notes.length)?'\nNotes:\n'+recipe.notes.map(n=>'- '+n).join('\n'):''}

${(recipe.nutrition)?'\nNutrition:\n'+Object.entries(recipe.nutrition).map(([k,v])=>'- '+k+': '+v).join('\n'):''}`.trim()
    navigator.clipboard.writeText(txt).then(() => showToast(), () => setWarn('Copy failed'))
  }

  function downloadJSON() {
    const data = recipe || {}
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = (data.title || 'recipe').replace(/\s+/g, '_').toLowerCase() + '.json'
    document.body.appendChild(a); a.click(); a.remove()
  }

  function clearAll() {
    setIngredients([])
    setPrefs(new Set())
    setInput(''); setMaxTime(''); setServings(2); setCuisine(''); setSkill('Easy')
    setStatus('Ready.'); setWarn(''); setRecipe(null)
  }

  React.useEffect(() => {
    function onReset() { clearAll() }
    function onAbout() { setAboutOpen(true) }
    window.addEventListener('chef-reset', onReset)
    window.addEventListener('chef-about', onAbout)
    function onKey(e){ if ((e.metaKey||e.ctrlKey) && e.key==='Enter'){ generate() } }
    document.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('chef-reset', onReset)
      window.removeEventListener('chef-about', onAbout)
      document.removeEventListener('keydown', onKey)
    }
  }, [ingredients, provider, model, modelCustom, apiKey, temperature, maxTime, servings, skill, cuisine, prefs])

  const selectedModels = MODELS[provider] || []
  const isCustom = model === '__custom__'

  return (
    <main>
      <div className="grid">
        <section className="card">
          <div className="row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            <div>
              <label>Provider</label>
              <div className="seg">
                {['openai','mistral','gemini','mock'].map(p => (
                  <button key={p} className={`seg-btn ${provider===p?'active':''}`} onClick={()=>handleSetProvider(p)} data-prov={p}>
                    {p.charAt(0).toUpperCase()+p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label>Model</label>
              <select value={model} onChange={e=>handleModelChange(e.target.value)}>
                {selectedModels.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
                <option value="__custom__">Custom…</option>
              </select>
              {isCustom && (
                <input
                  style={{marginTop:8}}
                  placeholder="Custom model id"
                  value={modelCustom}
                  onChange={e=>handleCustomModelChange(e.target.value)}
                />
              )}
              <div className="small">Pick from curated models per provider, or choose Custom…</div>
            </div>
          </div>

          <div className="kbar" style={{marginTop:10}}>
            <div style={{flex:1}}>
              <label>API Key</label>
              <input type={showKey?'text':'password'} value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder="Enter your API key" autoComplete="off" />
            </div>
            <button className="btn" onClick={()=>setShowKey(s=>!s)} title="Show/Hide key">👁️</button>
            <button className="btn" onClick={()=>{ if(!apiKey.trim()){showToast('No key to save');return;} localStorage.setItem(`chefgen.key.${provider}`, apiKey.trim()); showToast('Key saved locally') }} title="Save key locally">💾</button>
          </div>

          <div className="row" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10, marginTop:10}}>
            <div>
              <label>Temperature</label>
              <input type="number" min="0" max="2" step="0.1" value={temperature} onChange={e=>setTemperature(parseFloat(e.target.value)||0)} />
            </div>
            <div>
              <label>Max ready time (minutes)</label>
              <input type="number" min="0" step="5" value={maxTime} onChange={e=>setMaxTime(e.target.value)} placeholder="e.g. 20" />
            </div>
          </div>

          <div style={{marginTop:10}}>
            <label>Preset</label>
            <div className="tags">
              {['balanced','speed','quality'].map(name => (
                <span key={name} className={`pill ${preset===name?'active':''}`} data-preset={name} onClick={()=>handlePreset(name)}>
                  {name.charAt(0).toUpperCase()+name.slice(1)}
                </span>
              ))}
            </div>
          </div>

          <div style={{marginTop:10}}>
            <label>Ingredients you have (press Enter or comma)</label>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={onKeyDown} placeholder="e.g. chicken, tomatoes, garlic" />
            <div className="tags" style={{marginTop:8}}>
              {ingredients.map((item, idx) => (
                <span key={item+idx} className="pill" onClick={()=>removeIngredient(item)} title="Remove">{item}</span>
              ))}
            </div>
            <div className="small">Tip: paste a comma-separated list and press Enter.</div>
          </div>

          <div className="row3" style={{marginTop:10}}>
            <div>
              <label>Servings</label>
              <input type="number" min="1" value={servings} onChange={e=>setServings(Number(e.target.value)||1)} />
            </div>
            <div>
              <label>Skill level</label>
              <select value={skill} onChange={e=>setSkill(e.target.value)}>
                <option>Easy</option><option>Intermediate</option><option>Advanced</option>
              </select>
            </div>
            <div>
              <label>Cuisine</label>
              <select value={cuisine} onChange={e=>setCuisine(e.target.value)}>
                <option value="">Any</option><option>French</option><option>Italian</option>
                <option>Mexican</option><option>Indian</option><option>Japanese</option>
                <option>Mediterranean</option><option>Middle Eastern</option><option>American</option>
                <option>Thai</option><option>Chinese</option><option>Spanish</option>
              </select>
            </div>
          </div>

          <div style={{marginTop:10}}>
            <label>Dietary preferences</label>
            <div className="tags">
              {['vegetarian','vegan','gluten-free','dairy-free','halal','kosher','low-carb','high-protein'].map(k => (
                <span key={k} className={`pill ${prefs.has(k)?'active':''}`} onClick={()=>togglePref(k)} data-pref={k}>{k}</span>
              ))}
            </div>
          </div>

          <div className="hr"></div>
          <div className="footer">
            <button className="btn primary" onClick={generate}>🍳 Generate Recipe</button>
            <button className="btn" onClick={surprise}>🎲 Surprise me</button>
            <button className="btn" onClick={copyRender}>📋 Copy</button>
            <button className="btn" onClick={downloadJSON}>⬇️ Download JSON</button>
            <span className="small">⌘/Ctrl+Enter to generate</span>
          </div>
          {warn && <div className="small warn" style={{marginTop:6}}>{warn}</div>}
        </section>

        <section className="card out" id="output">
          <div className="small" id="status">{status}</div>
          <h2 id="title">{recipe ? (recipe.title || 'Untitled recipe') : 'Your recipe will appear here.'}</h2>
          <div className="meta" id="meta">
            {recipe && (
              <>
                {recipe.cuisine && <span className="chip">{recipe.cuisine}</span>}
                {recipe.difficulty && <span className="chip">{recipe.difficulty}</span>}
                {recipe.servings && <span className="chip">{recipe.servings} servings</span>}
                {recipe.ready_in_minutes && <span className="chip">{recipe.ready_in_minutes} min</span>}
              </>
            )}
          </div>
          <h3>Ingredients</h3>
          <ul className="list" id="ingList">
            {(recipe?.ingredients||[]).map((i,idx)=> (
              <li key={idx}>{`${i.quantity?i.quantity+' ':''}${i.item}${i.optional?' (optional)':''}`}</li>
            ))}
          </ul>
          <h3>Steps</h3>
          <ol className="list" id="steps">
            {(recipe?.steps||[]).map((s,idx)=> <li key={idx}>{s}</li>)}
          </ol>
          {!!(recipe?.notes && recipe.notes.length) && (
            <div id="notesBlock">
              <h3>Notes</h3>
              <ul className="list" id="notes">{recipe.notes.map((n,idx)=> <li key={idx}>{n}</li>)}</ul>
            </div>
          )}
          {!!recipe?.nutrition && (
            <div id="nutriBlock">
              <h3>Nutrition (approx.)</h3>
              <ul className="list" id="nutri">{Object.entries(recipe.nutrition).map(([k,v])=> <li key={k}>{k}: {v}</li>)}</ul>
            </div>
          )}
        </section>
      </div>

      <section className="card" style={{marginTop:16}}>
        <details>
          <summary><strong>Pantry shortcuts & examples</strong></summary>
          <div className="tags" style={{marginTop:8}}>
            {['pasta','eggs','cheese','garlic','onion','chicken','tomatoes','rice','beans','tuna','spinach','lemon'].map(item => (
              <span key={item} className="pill" onClick={()=>addMany(item)}>{item}</span>
            ))}
          </div>
          <div className="small" style={{marginTop:8}}>
            Example models: <code className="inline">gpt-4o-mini</code>, <code className="inline">gpt-4o</code>, <code className="inline">gpt-4.1-mini</code>,
            <code className="inline"> mistral-large-latest</code>, <code className="inline">mistral-medium-latest</code>, <code className="inline">gemini-1.5-flash</code>,
            <code className="inline"> gemini-1.5-pro</code>, <code className="inline">gemini-1.5-flash-8b</code>.
          </div>
        </details>
      </section>

      {!!toast && <div className="toast">{toast}</div>}

      {aboutOpen && (
        <dialog open style={{border:'none',borderRadius:14,padding:0,maxWidth:620,width:'100%'}}>
          <div className="card" style={{margin:0,borderRadius:14}}>
            <h2 style={{margin:'.2rem 0 .6rem'}}>About ChefGen</h2>
            <p className="small">
              A React version of your ChefGen app. It asks an LLM to return a strict JSON recipe, then renders it.
              Supports OpenAI, Mistral, and Google Gemini, plus a Demo provider.
              Keys may be stored in your browser (optional). For private/personal use only—never expose keys on public sites.
            </p>
            <ul className="small">
              <li>Cmd/Ctrl+Enter to generate • Theme toggle in header</li>
              <li>“Demo” provider returns a local sample (no key)</li>
              <li>Download JSON or copy the rendered recipe</li>
            </ul>
            <div style={{display:'flex',gap:10,justifyContent:'flex-end',marginTop:8}}>
              <button className="btn" onClick={()=>setAboutOpen(false)}>Close</button>
            </div>
          </div>
        </dialog>
      )}
    </main>
  )
}
