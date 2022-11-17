import { Paper } from '@mui/material';
import React from 'react'
import { useProfile } from '../../../Context/profile.context'
import { CalendarEvent } from '../../Common/CalendarEvent'

const Event = () => {
    const {loading,events}=useProfile();
  return (
    <Paper sx={{p:2}}><CalendarEvent events={events} loading={loading}/></Paper>
  )
}

export default Event