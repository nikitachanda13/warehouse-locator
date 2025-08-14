import React, { useState } from 'react'
import Products from './Products';

function App() {
  var [a,b] = useState(10);
  return (
    <div className='w-full h-screen bg-zinc-900 text-white p-4'>
      <Products naam="value" data={{age: 21,name: "Bibek"}} />
    </div>
  )
}

export default App