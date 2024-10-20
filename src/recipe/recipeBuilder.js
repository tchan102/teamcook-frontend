
import React, { useState, useRef } from 'react'
import RawIngredient from './RawIngredient'
import ProcessedIngredient from './ProcessedIngredient'
import {
  CListGroup,
  CListGroupItem,
  CRow,
  CCol,
  CFormInput,
  CButton,
  CContainer,
  CFormTextarea,
} from '@coreui/react'

const RecipeBuilder = () => {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Tomato', type: 'Raw Ingredient' },
    {
      id: 2,
      name: 'Tomato Sauce',
      type: 'Processed Ingredient',
      description: 'A rich, flavorful sauce made from ripe tomatoes.',
      ingredients: ['Tomatoes', 'Olive Oil', 'Garlic', 'Herbs', 'Salt'],
      allergens: ['May contain traces of celery'],
      shelfLife: '2 years when unopened',
    },
    { id: 3, name: 'Garlic', type: 'Raw Ingredient' },
    {
      id: 4,
      name: 'Pasta',
      type: 'Processed Ingredient',
      description: 'Dried pasta made from durum wheat.',
      ingredients: ['Durum wheat semolina', 'Water'],
      allergens: ['Contains wheat'],
      shelfLife: '2 years when unopened',
    },
  ])

  const [recipe, setRecipe] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [dishName, setDishName] = useState('New Recipe')
  const [isEditingDishName, setIsEditingDishName] = useState(false)
  const dishNameInputRef = useRef(null)
  const [steps, setSteps] = useState([''])

  const handleDragStart = (e, ingredient) => {
    e.dataTransfer.setData('application/json', JSON.stringify(ingredient))
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedIngredient = JSON.parse(e.dataTransfer.getData('application/json'))

    if (!recipe.some((item) => item.id === droppedIngredient.id)) {
      setRecipe((prevRecipe) => [...prevRecipe, droppedIngredient])
    }
  }

  const handleDeleteIngredient = (id) => {
    setRecipe((prevRecipe) => prevRecipe.filter((ingredient) => ingredient.id !== id))
  }

  const handleDishNameDoubleClick = () => {
    setIsEditingDishName(true)
    setTimeout(() => {
      dishNameInputRef.current?.focus()
      dishNameInputRef.current?.select()
    }, 0)
  }

  const handleDishNameBlur = () => {
    setIsEditingDishName(false)
  }

  const handleDishNameChange = (e) => {
    setDishName(e.target.value)
  }

  const handleDishNameKeyPress = (e) => {
    if (e.key === 'Enter') {
      setIsEditingDishName(false)
    }
  }

  const handleAddStep = () => {
    setSteps([...steps, ''])
  }

  const handleStepChange = (index, value) => {
    const newSteps = [...steps]
    newSteps[index] = value
    setSteps(newSteps)
  }

  const handleDeleteStep = (index) => {
    const newSteps = steps.filter((_, i) => i !== index)
    setSteps(newSteps)
  }

  const handleSave = () => {
    console.log('Saving recipe:', { dishName, ingredients: recipe, steps })
    alert('Recipe saved successfully!')
  }

  return (
    <CContainer fluid>
      <CRow className="mb-3 justify-content-between align-items-center">
        <CCol>
          <h2>Recipe Builder</h2>
        </CCol>
        <CCol xs="auto">
          <CButton color="primary" onClick={handleSave}>
            Save Recipe
          </CButton>
        </CCol>
      </CRow>
      <CRow>
        {/* INGREDIENT SEARCH */}
        <CCol xs={12} md={3}>
          <div className="d-flex align-items-center mb-3">
            <CFormInput
              type="text"
              placeholder="Search ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="me-2"
            />
          </div>

          {/* INGREDIENT LIST */}
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            <CListGroup flush>
              {ingredients
                .filter((ingredient) =>
                  ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((ingredient) => (
                  <div
                    key={ingredient.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, ingredient)}
                  >
                    <div style={{ position: 'relative' }}>
                      {ingredient.type === 'Raw Ingredient' ? (
                        <RawIngredient ingredient={ingredient} />
                      ) : (
                        <ProcessedIngredient ingredient={ingredient} />
                      )}
                    </div>
                  </div>
                ))}
            </CListGroup>
          </div>
        </CCol>

        {/* RECIPE BUILDER */}
        <CCol xs={12} md={5}>
          {isEditingDishName ? (
            <CFormInput
              type="text"
              value={dishName}
              onChange={handleDishNameChange}
              onBlur={handleDishNameBlur}
              onKeyPress={handleDishNameKeyPress}
              className="mb-3"
              ref={dishNameInputRef}
            />
          ) : (
            <h3
              onDoubleClick={handleDishNameDoubleClick}
              style={{ cursor: 'pointer' }}
              className="mb-3"
            >
              {dishName}
            </h3>
          )}
          <div
            style={{
              minHeight: '400px',
              border: '2px dashed #ccc',
              padding: '10px',
              borderRadius: '4px',
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {recipe.length === 0 ? (
              <p>Drag ingredients here to build your recipe</p>
            ) : (
              <CListGroup>
                {recipe.map((ingredient) => (
                  <CListGroupItem
                    key={ingredient.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    {ingredient.name} ({ingredient.type})
                    <CButton
                      color="danger"
                      size="sm"
                      onClick={() => handleDeleteIngredient(ingredient.id)}
                    >
                      Delete
                    </CButton>
                  </CListGroupItem>
                ))}
              </CListGroup>
            )}
          </div>
        </CCol>

        {/* RECIPE STEPS */}
        <CCol xs={12} md={4}>
          <h4>Recipe Steps</h4>
          {steps.map((step, index) => (
            <div key={index} className="mb-3">
              <CFormTextarea
                value={step}
                onChange={(e) => handleStepChange(index, e.target.value)}
                placeholder={`Step ${index + 1}`}
              />
              <CButton
                color="danger"
                size="sm"
                onClick={() => handleDeleteStep(index)}
                className="mt-2"
              >
                Delete Step
              </CButton>
            </div>
          ))}
          <CButton color="primary" onClick={handleAddStep}>
            Add Step
          </CButton>
        </CCol>
      </CRow>
    </CContainer>
  )
}

export default RecipeBuilder
