// Products.jsx
import React, { useState } from 'react'

function Products({naam, data}) {
    const [a, b] = useState(false);
  return (
    <div className='text-white'>
        <div className='w-full h-60 bg-zinc-800'>
            <h1 className={`${a === false ? "text-red-600" : "text-blue-600"}`}>{a === false ? "Hello" : "Hey"}</h1>
            <button onClick={()=>b(!a)}>change</button>
        </div>
    </div>
  )
}

export default Products
