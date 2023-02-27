import dynamic from 'next/dynamic';
// import Chart from 'react-apexcharts'
const Chart = dynamic(() => import('react-apexcharts'), { ssr: true });

// ----------------------------------------------------------------------

export { default as StyledChart } from './styles';

export { default as useChart } from './useChart';

export default Chart;
