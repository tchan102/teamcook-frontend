import React, { useState, useEffect } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CButton,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

import api from '../api'

const Testing = () => {
  // State variables for each action
  // Action 1: Add Stock
  const [ingredients, setIngredients] = useState([])
  const [selectedIngredient, setSelectedIngredient] = useState(null)
  const [amount, setAmount] = useState('')
  const [unit, setUnit] = useState('')
  const [message, setMessage] = useState('')

  // Action 2: Execute Processed Recipe
  const [processedRecipes, setProcessedRecipes] = useState([])
  const [selectedProcessedRecipe, setSelectedProcessedRecipe] = useState(null)
  const [quantityToProduce, setQuantityToProduce] = useState('')

  // Action 3: Execute Full Recipe
  const [fullRecipes, setFullRecipes] = useState([])
  const [selectedFullRecipe, setSelectedFullRecipe] = useState(null)
  const [quantityToPrepare, setQuantityToPrepare] = useState('')
  const [salePrice, setSalePrice] = useState('')

  // Action 4: Remove Expired Stock
  const [stocks, setStocks] = useState([])
  const [selectedStock, setSelectedStock] = useState(null)
  const [currentStockAmount, setCurrentStockAmount] = useState('')
  const [wasteAmount, setWasteAmount] = useState('')
  // State
  const [cost, setCost] = useState('')

  // Handler
  const handleCostChange = (e) => {
    setCost(e.target.value)
  }
  // Fetch data on component mount
  useEffect(() => {
    // Fetch raw ingredients for Action 1
    api
      .get('/ingredients/')
      .then((response) => {
        setIngredients(response.data.filter((ingredient) => ingredient.type === 'Raw'))
      })
      .catch((error) => {
        console.error('Error fetching ingredients:', error)
      })

    // Fetch processed recipes for Action 2
    api
      .get('/recipes/')
      .then((response) => {
        setProcessedRecipes(response.data.filter((recipe) => recipe.type === 'Processed'))
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error)
      })

    // Fetch full recipes for Action 3
    api
      .get('/recipes/')
      .then((response) => {
        setFullRecipes(response.data.filter((recipe) => recipe.type === 'Full Recipe'))
      })
      .catch((error) => {
        console.error('Error fetching recipes:', error)
      })

    // Fetch stocks for Action 4
    api
      .get('/stocks/')
      .then((response) => {
        setStocks(response.data)
      })
      .catch((error) => {
        console.error('Error fetching stocks:', error)
      })
  }, [])

  // Action 1: Add Stock
  const handleSelectIngredient = (ingredient) => {
    setSelectedIngredient(ingredient)
    setUnit(ingredient.unit)
  }

  const handleAmountChange = (e) => {
    setAmount(e.target.value)
  }

  const handleAddStock = () => {
    if (!selectedIngredient || !amount || !cost) {
      setMessage('Please select an ingredient and enter amount and cost.')
      return
    }

    // Create stock entry
    api
      .post('/stocks/', {
        name: `${selectedIngredient.name} Stock`,
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cost: parseFloat(cost),
        amount: parseFloat(amount),
        unit: selectedIngredient.unit,
        ingredient_id: selectedIngredient.id,
      })
      .then((response) => {
        setMessage('Stock added successfully.')
        // Reset form
        setSelectedIngredient(null)
        setAmount('')
        setUnit('')
      })
      .catch((error) => {
        console.error('Error adding stock:', error)
        setMessage('Error adding stock.')
      })
  }

  // Action 2: Execute Processed Recipe
  const handleSelectProcessedRecipe = (recipe) => {
    setSelectedProcessedRecipe(recipe)
  }

  const handleQuantityToProduceChange = (e) => {
    setQuantityToProduce(e.target.value)
  }

  const handleExecuteProcessedRecipe = () => {
    if (!selectedProcessedRecipe || !quantityToProduce) {
      setMessage('Please select a recipe and enter a quantity.')
      return
    }

    api
      .post('/execute_processed_recipe', {
        recipe_id: selectedProcessedRecipe.id,
        quantity: parseFloat(quantityToProduce),
        expiry_days: 30, // Optional
        processing_cost: 0, // Optional
      })
      .then((response) => {
        setMessage('Processed recipe executed successfully.')
        // Reset form
        setSelectedProcessedRecipe(null)
        setQuantityToProduce('')
      })
      .catch((error) => {
        console.error('Error executing processed recipe:', error)
        setMessage('Error executing processed recipe.')
      })
  }

  // Action 3: Execute Full Recipe
  const handleSelectFullRecipe = (recipe) => {
    setSelectedFullRecipe(recipe)
  }

  const handleQuantityToPrepareChange = (e) => {
    setQuantityToPrepare(e.target.value)
  }

  const handleSalePriceChange = (e) => {
    setSalePrice(e.target.value)
  }

  const handleExecuteFullRecipe = () => {
    if (!selectedFullRecipe || !quantityToPrepare || !salePrice) {
      setMessage('Please select a recipe, enter quantity and sale price.')
      return
    }

    api
      .post('/execute_full_recipe', {
        recipe_id: selectedFullRecipe.id,
        quantity: parseFloat(quantityToPrepare),
        sale_price: parseFloat(salePrice),
      })
      .then((response) => {
        setMessage('Full recipe executed and sale recorded successfully.')
        // Reset form
        setSelectedFullRecipe(null)
        setQuantityToPrepare('')
        setSalePrice('')
      })
      .catch((error) => {
        console.error('Error executing full recipe:', error)
        setMessage('Error executing full recipe.')
      })
  }

  // Action 4: Remove Expired Stock
  const handleSelectStock = (stock) => {
    setSelectedStock(stock)
    setCurrentStockAmount(stock.amount)
  }

  const handleWasteAmountChange = (e) => {
    setWasteAmount(e.target.value)
  }

  const handleRemoveExpiredStock = () => {
    if (!selectedStock || !wasteAmount) {
      setMessage('Please select a stock and enter the amount to remove.')
      return
    }

    // Create waste record
    api
      .post('/wastes/', {
        stock_id: selectedStock.id,
        waste_amount: parseFloat(wasteAmount),
        unit: selectedStock.unit,
        reason: 'Expired',
        notes: 'Removed via testing page',
      })
      .then((response) => {
        // Update stock amount
        const newAmount = selectedStock.amount - parseFloat(wasteAmount)
        api
          .put(`/stocks/${selectedStock.id}`, {
            amount: newAmount >= 0 ? newAmount : 0,
          })
          .then(() => {
            setMessage('Expired stock removed and waste recorded successfully.')
            // Reset form
            setSelectedStock(null)
            setCurrentStockAmount('')
            setWasteAmount('')
            // Refresh stocks
            api
              .get('/stocks/')
              .then((response) => {
                setStocks(response.data)
              })
              .catch((error) => {
                console.error('Error fetching stocks:', error)
              })
          })
          .catch((error) => {
            console.error('Error updating stock amount:', error)
            setMessage('Error updating stock amount.')
          })
      })
      .catch((error) => {
        console.error('Error recording waste:', error)
        setMessage('Error recording waste.')
      })
  }

  return (
    <div style={{ padding: '20px' }}>
      {/* Action 1: Add Stock */}
      <h2>Action 1: Add Stock</h2>
      <CRow className="align-items-center mb-4">
        <CCol sm={3}>
          <CDropdown>
            <CDropdownToggle color="secondary">
              {selectedIngredient ? selectedIngredient.name : 'Select Ingredient'}
            </CDropdownToggle>
            <CDropdownMenu>
              {ingredients.map((ingredient) => (
                <CDropdownItem
                  key={ingredient.id}
                  onClick={() => handleSelectIngredient(ingredient)}
                >
                  {ingredient.name}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={handleAmountChange}
          />
        </CCol>
        <CCol sm={2}>
          <CFormInput type="number" placeholder="Cost" value={cost} onChange={handleCostChange} />
        </CCol>
        <CCol sm={2}>
          <CFormInput type="text" placeholder="Unit" value={unit} disabled />
        </CCol>
        <CCol sm={2}>
          <CButton color="primary" onClick={handleAddStock}>
            Submit
          </CButton>
        </CCol>
      </CRow>

      {/* Action 2: Execute Processed Recipe */}
      <h2>Action 2: Execute Processed Recipe</h2>
      <CRow className="align-items-center mb-4">
        <CCol sm={8}>
          <CDropdown>
            <CDropdownToggle color="secondary">
              {selectedProcessedRecipe ? selectedProcessedRecipe.name : 'Select Processed Recipe'}
            </CDropdownToggle>
            <CDropdownMenu>
              {processedRecipes.map((recipe) => (
                <CDropdownItem key={recipe.id} onClick={() => handleSelectProcessedRecipe(recipe)}>
                  {recipe.name}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol sm={2}>
          <CFormInput
            type="number"
            placeholder="Quantity"
            value={quantityToProduce}
            onChange={handleQuantityToProduceChange}
          />
        </CCol>
        <CCol sm={2}>
          <CButton color="primary" onClick={handleExecuteProcessedRecipe}>
            Submit
          </CButton>
        </CCol>
      </CRow>

      {/* Action 3: Execute Full Recipe */}
      <h2>Action 3: Execute Full Recipe</h2>
      <CRow className="align-items-center mb-4">
        <CCol sm={3}>
          <CDropdown>
            <CDropdownToggle color="secondary">
              {selectedFullRecipe ? selectedFullRecipe.name : 'Select Full Recipe'}
            </CDropdownToggle>
            <CDropdownMenu>
              {fullRecipes.map((recipe) => (
                <CDropdownItem key={recipe.id} onClick={() => handleSelectFullRecipe(recipe)}>
                  {recipe.name}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="number"
            placeholder="Quantity"
            value={quantityToPrepare}
            onChange={handleQuantityToPrepareChange}
          />
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="number"
            placeholder="Sale Price"
            value={salePrice}
            onChange={handleSalePriceChange}
          />
        </CCol>
        <CCol sm={3}>
          <CButton color="primary" onClick={handleExecuteFullRecipe}>
            Submit
          </CButton>
        </CCol>
      </CRow>

      {/* Action 4: Remove Expired Stock */}
      <h2>Action 4: Remove Expired Stock</h2>
      <CRow className="align-items-center mb-4">
        <CCol sm={3}>
          <CDropdown>
            <CDropdownToggle color="secondary">
              {selectedStock ? selectedStock.name : 'Select Stock'}
            </CDropdownToggle>
            <CDropdownMenu>
              {stocks.map((stock) => (
                <CDropdownItem key={stock.id} onClick={() => handleSelectStock(stock)}>
                  {stock.name}
                </CDropdownItem>
              ))}
            </CDropdownMenu>
          </CDropdown>
        </CCol>
        <CCol sm={3}>
          <CFormInput
            type="text"
            placeholder="Current Amount"
            value={currentStockAmount}
            disabled
          />
        </CCol>
        <CCol sm={2}>
          <CFormInput
            type="number"
            placeholder="Amount to Remove"
            value={wasteAmount}
            onChange={handleWasteAmountChange}
          />
        </CCol>
        <CCol sm={2}>
          <CFormInput
            type="text"
            placeholder="Unit"
            value={selectedStock ? selectedStock.unit : ''}
            disabled
          />
        </CCol>
        <CCol sm={2}>
          <CButton color="primary" onClick={handleRemoveExpiredStock}>
            Submit
          </CButton>
        </CCol>
      </CRow>

      {/* Display message */}
      {message && <p>{message}</p>}
    </div>
  )
}

export default Testing
