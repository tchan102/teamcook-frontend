import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilTruck } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Inventory',
    to: '/Inventory',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
]

export default _nav
