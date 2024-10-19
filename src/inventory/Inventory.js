import { CCard, CCardBody, CCol, CCardHeader, CRow, CAlert } from '@coreui/react'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'
import React from 'react'

const Inventory = () => {
  return (
    <>
      <h1>Papa John Inventory</h1>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CChartDoughnut
                style={{ height: '300px' }}
                data={{
                  labels: ['Raw', 'Processed'],
                  datasets: [
                    {
                      backgroundColor: ['#41B883', '#E46651'],
                      data: [123, 64],
                    },
                  ],
                }}
              />
              Total item: 187
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CAlert color="danger" dismissible>
        <strong>Significantly low!</strong> Potato
      </CAlert>
      <CAlert color="warning" dismissible>
        <strong>Low!</strong> Tomato
      </CAlert>
    </>
  )
}

export default Inventory
