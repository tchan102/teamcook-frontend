import React, { useState, useRef } from 'react'
import Ingredient from './Ingredient'

const ProcessedIngredient = ({ ingredient }) => {
  const [showPopup, setShowPopup] = useState(false)
  const timerRef = useRef(null)

  const handleMouseEnter = () => {
    timerRef.current = setTimeout(() => {
      setShowPopup(true)
    }, 1500) // 1.3 seconds delay
  }

  const handleMouseLeave = () => {
    clearTimeout(timerRef.current)
    setShowPopup(false)
  }

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Ingredient ingredient={ingredient} badgeColor="warning" badgeText="PI">
        {showPopup && (
          <div
            className="popup-window"
            style={{
              position: 'absolute',
              zIndex: 1000,
              background: 'white',
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '4px',
              boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
              width: '250px',
            }}
          >
            <h4 style={{ marginTop: 0 }}></h4>
            <p>
              <strong>Type:</strong>{' '}
            </p>
            <p>
              <strong>Description:</strong>{' '}
            </p>
            <p>
              <strong>Ingredients:</strong>
            </p>
            <p>
              <strong>Allergens:</strong>{' '}
            </p>
            <p>
              <strong>Shelf Life:</strong>{' '}
            </p>
          </div>
        )}
      </Ingredient>
    </div>
  )
}

export default ProcessedIngredient
