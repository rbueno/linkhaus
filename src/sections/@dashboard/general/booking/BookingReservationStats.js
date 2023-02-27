import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Card, Box, Typography } from '@mui/material';
// components
import Chart, { useChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

BookingReservationStats.propTypes = {
  chart: PropTypes.object,
  title: PropTypes.string,
  subheader: PropTypes.string,
};

export default function BookingReservationStats({ title, subheader, chart, ...other }) {
  const { categories, colors, series, options } = chart;

  const chartOptions = useChart({
    colors,
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories,
    },
    tooltip: {
      y: {
        formatter: (value) => `$${value}`,
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      {/* <Chart type="bar" series={series[0].data} options={chartOptions} height={364} /> */}
      <Box>
        <Typography>Teste</Typography>
      </Box>
    </Card>
  );
}
