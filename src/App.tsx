import { Routes, Route } from 'react-router'
import HomePage from './components/HomePage'
import GamePage from './components/GamePage'

const App = () => (
  <div className='App'>
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/play/:name1/:name2' element={<GamePage />} />
    </Routes>
  </div>
)

export default App
