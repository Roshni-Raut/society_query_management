import { CChart } from '@coreui/react-chartjs'
import React from 'react'

export const BarChart = ({count}) => {
  return (

    <CChart
      type="bar"
      data={{
        labels: ['Pending', 'Under Watch', 'Solved', 'Rejected'],
        datasets: [
        {
          label:"Count of Query",
          backgroundColor: ['#ffbb33',"#33b5e5","#00C851","#ff4444"],
          data:count,
        },
      ],
    }}
    labels="Status"
    />
  )
}
