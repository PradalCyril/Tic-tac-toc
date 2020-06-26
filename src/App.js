import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from './components/HomePage/index';
import GamePage from './components/GamePage/index';

function App() {
  return (
    <div className="App">
    <Switch >
      <Route exact path='/' component={HomePage} />
      <Route path='/play/:name1/:name2' component={GamePage} />
    </Switch>
    </div>
  );
}

export default App;
