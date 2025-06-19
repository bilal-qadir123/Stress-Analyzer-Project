import React, { useState } from 'react'
import "./App.css";

function Button() {

  const [hover, setHover] = useState(false);
  return (
    <div>
      <button  className='button' style={{ position: "relative", left: 300, backgroundColor: hover ? "#3A8CD8" : "#61ABFA", transition: "background-color 0.3s ease", border: "none", padding: "10px 20px", borderRadius: "5px", fontFamily: "Outfit", fontWeight: 400, cursor: "pointer" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      > LOGIN </button>
      </div>
  )
}

export default Button