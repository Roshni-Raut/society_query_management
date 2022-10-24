import { Alert, Snackbar } from '@mui/material'
import React from 'react'

const Snackbars = ({error,success}) => {
  return (
    <div><Snackbar open={ error!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
    <Alert   variant="filled" severity="error" sx={{ minWidth: '220px' }}>{error}</Alert>
  </Snackbar>
  <Snackbar open={ success!=="" } anchorOrigin={{ vertical: 'top', horizontal: 'center', }} >
    <Alert   variant="filled" severity="success" sx={{ minWidth: '220px' }}>{success}</Alert>
  </Snackbar>
  </div>
  )
}

export default Snackbars