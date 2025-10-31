import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Header from './components/header.jsx';

function App() {


return (
    <div className="app-container">
      <Header/>

      <main className="main-container">
        <p>Selamat datang di Crypto Tracker!</p>
      </main>
    </div>
  );
}

export default App;
