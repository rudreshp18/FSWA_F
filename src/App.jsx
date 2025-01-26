import React, { useEffect } from 'react';
import Login from './components/Login';

function App() {

  useEffect(() => {
    sessionStorage.clear()
  }, [])

  return (
    <div className='bg-blue-400 h-screen w-screen'>
      <Login />
    </div>
  );
}

export default App;
