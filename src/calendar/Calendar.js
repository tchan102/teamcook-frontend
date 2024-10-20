import React, { useState } from 'react'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CRow,
  CCol,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel,
} from '@coreui/react'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [view, setView] = useState('month') // 'month' or 'week'
  const [events, setEvents] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [newEvent, setNewEvent] = useState('')

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const formatDateKey = (date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  }

  const onDateClick = (day) => {
    setSelectedDate(day)
  }

  const onDateDoubleClick = (day) => {
    setSelectedDate(day)
    setShowModal(true)
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const onAddEvent = () => {
    if (newEvent.trim() !== '') {
      setEvents((prev) => ({
        ...prev,
        [formatDateKey(selectedDate)]: [
          ...(prev[formatDateKey(selectedDate)] || []),
          newEvent.trim(),
        ],
      }))
      setNewEvent('')
      setShowModal(false)
    }
  }

  const renderHeader = () => {
    return (
      <CRow className="align-items-center">
        <CCol xs={2}>
          <CButton color="primary" onClick={prevMonth}>
            Previous
          </CButton>
        </CCol>
        <CCol xs={8} className="text-center">
          <h4>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h4>
        </CCol>
        <CCol xs={2} className="text-end">
          <CButton color="primary" onClick={nextMonth}>
            Next
          </CButton>
        </CCol>
      </CRow>
    )
  }

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return (
      <CRow>
        {days.map((day) => (
          <CCol key={day} className="text-center fw-bold">
            {day}
          </CCol>
        ))}
      </CRow>
    )
  }

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDate = new Date(monthStart)
    startDate.setDate(startDate.getDate() - startDate.getDay())
    const endDate = new Date(monthEnd)
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()))

    const rows = []
    let days = []
    let day = new Date(startDate)

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day)
        const formattedDate = day.getDate()
        days.push(
          <CCol
            key={day}
            className={`p-2 border ${
              day.getMonth() !== currentDate.getMonth()
                ? 'text-muted'
                : day.toDateString() === selectedDate.toDateString()
                  ? 'bg-primary text-white'
                  : ''
            }`}
            onClick={() => onDateClick(cloneDay)}
            onDoubleClick={() => onDateDoubleClick(cloneDay)}
          >
            <div>{formattedDate}</div>
            {events[formatDateKey(day)] && (
              <div className="small mt-1">
                {events[formatDateKey(day)].map((event, index) => (
                  <div key={index} className="text-truncate">
                    {event}
                  </div>
                ))}
              </div>
            )}
          </CCol>,
        )
        day.setDate(day.getDate() + 1)
      }
      rows.push(
        <CRow key={day} className="g-0">
          {days}
        </CRow>,
      )
      days = []
    }
    return <div className="mt-2">{rows}</div>
  }

  const renderWeekView = () => {
    const weekStart = new Date(selectedDate)
    weekStart.setDate(selectedDate.getDate() - selectedDate.getDay())
    const days = []

    for (let i = 0; i < 7; i++) {
      const cloneDay = new Date(weekStart)
      cloneDay.setDate(weekStart.getDate() + i)
      days.push(
        <CCol
          key={i}
          className={`p-2 border ${
            cloneDay.toDateString() === selectedDate.toDateString() ? 'bg-primary text-white' : ''
          }`}
          onClick={() => onDateClick(cloneDay)}
          onDoubleClick={() => onDateDoubleClick(cloneDay)}
        >
          <div>{cloneDay.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}</div>
          {events[formatDateKey(cloneDay)] && (
            <div className="small mt-1">
              {events[formatDateKey(cloneDay)].map((event, index) => (
                <div key={index} className="text-truncate">
                  {event}
                </div>
              ))}
            </div>
          )}
        </CCol>,
      )
    }
    return <CRow className="g-0 mt-2">{days}</CRow>
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          {renderHeader()}
          <CRow className="mt-2">
            <CCol xs={6}>
              <CButton
                color={view === 'month' ? 'primary' : 'secondary'}
                onClick={() => setView('month')}
                className="me-2"
              >
                Month
              </CButton>
              <CButton
                color={view === 'week' ? 'primary' : 'secondary'}
                onClick={() => setView('week')}
              >
                Week
              </CButton>
            </CCol>
          </CRow>
        </CCardHeader>
        <CCardBody>
          {renderDays()}
          {view === 'month' ? renderCells() : renderWeekView()}
        </CCardBody>
        <CCardFooter>
          <p>Selected Date: {formatDate(selectedDate)}</p>
          <p>Double-click a date to add an event</p>
        </CCardFooter>
      </CCard>

      <CModal visible={showModal} onClose={() => setShowModal(false)}>
        <CModalHeader closeButton>
          <CModalTitle>Add Event for {formatDate(selectedDate)}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm>
            <CFormLabel htmlFor="newEvent">Event Details</CFormLabel>
            <CFormInput
              id="newEvent"
              placeholder="Enter event details"
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowModal(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={onAddEvent}>
            Add Event
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default Calendar
