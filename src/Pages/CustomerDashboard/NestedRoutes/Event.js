import React from 'react'
import { useProfile } from '../../../Context/profile.context'
import { CalendarEvent } from '../../Common/CalendarEvent'

const Event = () => {
    const {loading,events}=useProfile();
  return (
    <div><CalendarEvent events={events} loading={loading}/></div>
  )
}

export default Event