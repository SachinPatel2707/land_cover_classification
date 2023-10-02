import React from 'react'
import "../navbar/Navbar2.css"

const Navbar2 = () => {
  return (
    <div className='nav'>
      <a className='navlinks' href="#">Home</a>
      <a className='navlinks' href="/classify">Classify</a>
      <a className='navlinks' href="#">Instructions</a>
      <a className='navlinks' href="#">About</a>
      <a className='navlinks' href="#">Team</a>
    </div>
  )
}

export default Navbar2