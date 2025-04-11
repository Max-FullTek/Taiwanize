import './App.scss';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import { ThemeProvider } from './context/ThemeContext';

function App() {

  return (
    <ThemeProvider>
      <div className="app-layout">
        <Header />
        <main className="app-main">
          <Home />
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
