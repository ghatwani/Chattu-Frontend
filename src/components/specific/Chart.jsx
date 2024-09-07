import React from 'react'
import { Line, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Tooltip, Filler, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Legend, plugins } from "chart.js";
import { orange } from '@mui/material/colors';
import { purple, purpleLight } from '../constants/color';


ChartJS.register(Tooltip, Filler, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Legend)

const lineChartOptions={
  responsive:true,
  plugins:{
    legend:{
      display: false,
    },
    title:{
      display:false,
    },
  },

  scales:{
    x:{
      grid:{
        display:false,
      }
    },
    y:{
      beginAtZero:true,
      grid:{
        display:false,
      }
    }
  }
}
const LineChart = ({value=[]}) => {
  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      data:value,
      label:"Messages",
      fill: true,
      backgroundColor:"rgba(72, 192, 192, 0.2)",
      borderColor:"rgba(75, 192, 192 ,1)"
    },
  ]
  }
  return (
    <Line data={data} options={lineChartOptions}/>
  )
}

const doughnutChartOptions={
  responsive:true,
  plugins:{
    legend:{
      display:false,
    },
    title:{
      display:false
    }
  }
};
const DoughnutChart = ({value=[], labels=[]}) => {
  const data={
    labels,
    datasets: [{
      data:value,
      backgroundColor:['Brown','orange'],
      borderColor:['purple', 'orange'],
      hoverColor:['lightPurple', 'lightOrange'],
      offset:12
    }]
  }
  return (
    <Doughnut data={data} options={doughnutChartOptions}/>
  )
}

export { LineChart, DoughnutChart }