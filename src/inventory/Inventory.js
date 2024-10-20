import { CCard, CCardBody, CCol, CCardHeader, CRow, CAlert } from '@coreui/react'
import { CChartDoughnut } from '@coreui/react-chartjs'
import React, { useEffect, useState } from 'react'
import api from '../api'
import StockList from './StockList'
const Inventory = () => {
  const [stockCounts, setStockCounts] = useState({ raw_count: 0, processed_count: 0 })

  useEffect(() => {
    // Fetch stock counts
    api
      .get('/stats/stock_counts')
      .then((response) => {
        setStockCounts(response.data)
      })
      .catch((error) => {
        console.error('Error fetching stock counts:', error)
      })
  }, [])
  return (
    <>
      <h1>Papa John Inventory</h1>
      <CRow>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CChartDoughnut
                style={{ height: '300px' }}
                data={{
                  labels: ['Raw', 'Processed'],
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#E46651'],
                      data: [stockCounts.raw_count, stockCounts.processed_count],
                    },
                  ],
                }}
              />
              Total item: {stockCounts.raw_count + stockCounts.processed_count}
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={6}>
          <CCard className="mb-4">
            <CCardBody>
              <CAlert color="danger" dismissible>
                <strong>Significantly low!</strong> Potato
              </CAlert>
              <CAlert color="warning" dismissible>
                <strong>Low!</strong> Tomato
              </CAlert>
              <CAlert color="warning" dismissible>
                <strong>Low!</strong> Tomato
              </CAlert>
              <CAlert color="warning" dismissible>
                <strong>Low!</strong> Tomato
              </CAlert>
              <CAlert color="warning" dismissible>
                <strong>Low!</strong> Tomato
              </CAlert>
              <CAlert color="warning" dismissible>
                <strong>Low!</strong> Tomato
              </CAlert>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm={12}>
          <StockList />
        </CCol>
      </CRow>
    </>
  )
}

export default Inventory
