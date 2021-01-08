// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorageState(
  key,
  defaultValue = '',
  serialize = JSON.stringify,
  deserialize = JSON.parse,
) {
  const [value, setValue] = React.useState(() => {
    const valueFromLocalStorage = window.localStorage.getItem(key)

    if (valueFromLocalStorage) {
      return deserialize(valueFromLocalStorage)
    }

    return typeof defaultValue === 'function' ? defaultValue() : defaultValue
  })

  const prevRefKey = React.useRef(key)

  React.useEffect(() => {
    const prevKey = prevRefKey.current

    if (prevKey !== key) {
      window.localStorage.removeItem(prevKey)
    }
    window.localStorage.setItem(key, serialize(value))
  }, [key, value, serialize])

  return [value, setValue]
}

function Greeting({initialName = ''}) {
  const [name, setName] = useLocalStorageState('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" value={name} />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
