import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

import FibPage from './FibPage';
import OtherPage from './OtherPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Fib Calculator</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '1rem', marginBottom: '1rem' }}>
            <Link className="App-link" to="/">Home</Link>
            <Link className="App-link" to="/other-page">Other Page</Link>
          </div>
        </header>
        <Switch>
          <Route exact path="/" component={FibPage} />
          <Route path="/other-page" component={OtherPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
