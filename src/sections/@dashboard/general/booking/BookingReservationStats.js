import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, Box, Typography } from '@mui/material';
// components
import Chart, { useChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

export default function BookingReservationStats() {


  


  const demostate = {
          
    series: [{
        name: "Desktops",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    },
  

}
  return (
    <Card >
      <Chart options={demostate.options} series={demostate.series} type="line" height={350} />
      {/* <Box>
        <Typography>Teste</Typography>
      </Box> */}
    </Card>
  );
}
