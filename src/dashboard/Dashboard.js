import React from 'react'
import { Link } from 'react-router-dom'
import { CWidgetStatsA, CWidgetStatsD, CRow, CCol, CButton } from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import CIcon from '@coreui/icons-react'
import { cilTruck } from '@coreui/icons'

const Dashboard = () => {
  return (
    <>
      <h1>Welcome to Papa John</h1>
      <CRow>
        <CCol xs={12}>
          <Link to="/inventory" style={{ textDecoration: 'none' }}>
            <CWidgetStatsD
              className="mb-3"
              icon={<CIcon className="my-4 text-white" href="" icon={cilTruck} height={52} />}
              chart={
                <CChartLine
                  className="position-absolute w-100 h-100"
                  data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                    datasets: [
                      {
                        backgroundColor: 'rgba(255,255,255,.1)',
                        borderColor: 'rgba(255,255,255,.55)',
                        pointHoverBackgroundColor: '#fff',
                        borderWidth: 2,
                        data: [65, 59, 84, 84, 51, 55, 40],
                        fill: true,
                      },
                    ],
                  }}
                  options={{
                    elements: {
                      line: {
                        tension: 0.4,
                      },
                      point: {
                        radius: 0,
                        hitRadius: 10,
                        hoverRadius: 4,
                        hoverBorderWidth: 3,
                      },
                    },
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: false,
                      },
                    },
                    scales: {
                      x: {
                        display: false,
                      },
                      y: {
                        display: false,
                      },
                    },
                  }}
                />
              }
              style={{ '--cui-card-cap-bg': '#3b5998' }}
              values={[
                { title: 'Raw Ingredient', value: '123' },
                { title: 'Processed Ingredient', value: '64' },
              ]}
            />
          </Link>
        </CCol>
      </CRow>
      <CRow>
        <CCol sm={4}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={<>Recipe Book</>}
            action={
              <Link to="/recipebook" style={{ textDecoration: 'none' }}>
                <CButton color="light">Go</CButton>
              </Link>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '90px' }}
                data={{
                  labels: ['x'],
                }}
              />
            }
          />
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsA
            className="mb-4"
            color="success"
            value={<>Budget</>}
            action={
              <Link to="/budget" style={{ textDecoration: 'none' }}>
                <CButton color="light">Go</CButton>
              </Link>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '90px' }}
                data={{
                  labels: ['x'],
                }}
              />
            }
          />
        </CCol>
        <CCol sm={4}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={<>Calendar</>}
            action={
              <Link to="/calendar" style={{ textDecoration: 'none' }}>
                <CButton color="light">Go</CButton>
              </Link>
            }
            chart={
              <CChartLine
                className="mt-3 mx-3"
                style={{ height: '90px' }}
                data={{
                  labels: ['x'],
                }}
              />
            }
          />
        </CCol>
        <CCol sm={12}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={<>Team</>}
            action={
              <Link to="/team" style={{ textDecoration: 'none' }}>
                <CButton color="light">Go</CButton>
              </Link>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: '90px' }}
                data={{
                  labels: ['x'],
                }}
              />
            }
          />
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
