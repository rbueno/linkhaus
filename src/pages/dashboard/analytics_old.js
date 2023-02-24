// next
import { useEffect, useState, useCallback } from 'react'
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Grid, Container, Typography, Box, TextField, Stack, MenuItem } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { DatePicker } from '@mui/x-date-pickers/DatePicker'

import { add } from 'date-fns'
// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_
import { _analyticPost, _analyticOrderTimeline, _analyticTraffic } from '../../_mock/arrays';
// components
import { useSettingsContext } from '../../components/settings';
// import { useAuthContext } from '../../auth/useAuthContext';
// sections
import {
  AnalyticsTasks,
  AnalyticsNewsUpdate,
  AnalyticsOrderTimeline,
  AnalyticsCurrentVisits,
  AnalyticsWebsiteVisits,
  AnalyticsTrafficBySite,
  AnalyticsWidgetSummary,
  AnalyticsCurrentSubject,
  AnalyticsConversionRates,
} from '../../sections/@dashboard/general/analytics';
import api from '../../utils/axios'
// import { PATH_DASHBOARD } from '../../routes/paths'

// ----------------------------------------------------------------------



const SERVICE_OPTIONS = [
  'Hoje',
  '7 dias',
  '14 dias',
  '30 dias',
  '90 dias',
  '180 dias',
  '365 dias',
  // 'Este mês',
  // 'Último mês',
  // 'Últimos 3 mês',
  // 'Últimos 6 mês',
  // 'Últimos 12 mês',
  'Customizado'
];

const INPUT_WIDTH = 160;

export function FetchController() {

  const [filterService, setFilterService] = useState('30 dias');

  const [filterStartDate, setFilterStartDate] = useState(null);

  const [filterEndDate, setFilterEndDate] = useState(null);

  const [pickDateStart, setPickDateStart] = useState(null);

  const [pickDateEnd, setPickDateEnd] = useState(null);

  const [isSubmittingDateFilter, setIsSubmittingDateFilter] = useState(false)

  function buildDateInterval(value) {
    if (value === 'Customizado') return { startDate: null, endDate: null }
    const rangeType = {
      'Hoje': { start: {}, end: {} },
      '7 dias': { start: { days: -7}, end: { days: -1} },
      '14 dias': { start: { days: -7}, end: {days: -1} },
      '30 dias': { start: { days: -30}, end: {days: -1} },
      '90 dias': { start: { days: -90}, end: {days: -1} },
      '180 dias': { start: { days: -180}, end: {days: -1} },
      '365 dias': { start: { days: -365}, end: {days: -1} },
      // 'Este mês': { start: { days: -7}, end: {days: -1} },
      // 'Último mês': { start: { days: -7}, end: {days: -1} },
      // 'Últimos 3 mês': { start: { days: -7}, end: {days: -1} },
      // 'Últimos 6 mês': { start: { days: -7}, end: {days: -1} },
      // 'Últimos 12 mês': { start: { days: -7}, end: {days: -1} },
      // 'Customizado': { start: {}, end: {} },
    }
    return {
      startDate: add(new Date(), rangeType[value].start),
      endDate: add(new Date(), rangeType[value].end)
    }
  }

  const fetchData = useCallback(async (startDate, endDate) => {
    console.log('startDate', startDate)
    console.log('filterStartDate', filterStartDate)
    const start = startDate || filterStartDate
    const end = endDate || filterEndDate
    
    console.log('start', start)
    console.log('end', end)
    const query = start && end ? `/v1/evententry?startDate=${start}&endDate=${end}` : `/v1/evententry`
    try {
      const response = await api.get(query)
      // console.log('_mock', _mock)
      console.log('response.data', response.data)
      // setTableData(response.data.deals)
      // setDataFiltered(response.data.deals)
      // setStageCount(response.data.stageCount)
      // setTablePaging(response.data.paging)
    } catch (error) {
      console.log('error sales get', error)
    }
  },[filterStartDate, filterEndDate])

  useEffect(() => {
     fetchData()
  },[fetchData])

  const handleSetCustomDateFilter = (ref, newValue) => {

    if (ref === 'start') {
      setFilterStartDate(newValue)
      setPickDateStart(newValue)
    }
    if (ref === 'end') {
      setFilterEndDate(newValue)
      setPickDateEnd(newValue)
    }
    // setFilterService('Customizado')
  }

  const handleSubmitDateFilter = async (startDate, endDate) => {
    setIsSubmittingDateFilter(true)
    setFilterStartDate(startDate)
    setFilterEndDate(endDate)
    
    try {
      // setPage(0)
      await fetchData(startDate, endDate)
    setIsSubmittingDateFilter(false)
    } catch(error) {
      console.log('deu erro', error)
    }
  }

  const handleFilterService = async (event) => {
    const dateFilter = event.target.value
    const {startDate, endDate} = buildDateInterval(dateFilter)
    
    setFilterService(event.target.value);
    // eslint-disable-next-line no-unused-expressions
    dateFilter !== 'Customizado' && await handleSubmitDateFilter(startDate, endDate)
  };

  return (
    <Box display='flex' justifyContent='space-between' alignContent='center' alignItems='center'>
        <Typography variant="h4" >Período</Typography>
        <Stack spacing={2} direction={{ xs: 'column', md: 'row' }} sx={{ py: 2.5, px: 3 }}>
        {
          filterService === 'Customizado' && <>
            <DatePicker
            label="Start date"
            value={pickDateStart}
            onChange={(newValue) => {
              handleSetCustomDateFilter('start', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  maxWidth: { md: INPUT_WIDTH },
                }}
              />
            )}
          />

          <DatePicker
            label="End date"
            value={pickDateEnd}
            onChange={(newValue) => {
              handleSetCustomDateFilter('end', newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                sx={{
                  maxWidth: { md: INPUT_WIDTH },
                }}
              />
            )}
          />
          <LoadingButton
            disabled={!filterStartDate || !filterEndDate}
            variant='contained'
            loading={isSubmittingDateFilter}
            onClick={() => handleSubmitDateFilter(filterStartDate, filterEndDate)}
          >
            Aplicar
          </LoadingButton>
          </>
        }
          

          <TextField
                  fullWidth
                  select
                  label="Intervalo"
                  value={filterService}
                  onChange={handleFilterService}
                  SelectProps={{
                    MenuProps: {
                      sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                    },
                  }}
                  sx={{
                    maxWidth: { md: INPUT_WIDTH },
                    textTransform: 'capitalize',
                  }}
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <MenuItem
                      key={option}
                      value={option}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {option}
                    </MenuItem>
                  ))}
          </TextField>
              </Stack>
      </Box>
  )

}






// ----------------------------------------------------------------------

GeneralAnalyticsPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function GeneralAnalyticsPage() {
  const theme = useTheme();
  // const { currentWorkspace, updateWorkspaces } = useAuthContext()
  const { themeStretch } = useSettingsContext();

  // const { push } = useRouter()
  // useEffect(() => {
  //   if (!currentWorkspace) push(PATH_DASHBOARD.business.new)
  // }, [currentWorkspace, push])


  return (
    <>
      <Head>
        <title> General: Analytics | Minimal UI</title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Typography variant="h4" sx={{ mb: 5 }}>
          Analytics
        </Typography>

        <FetchController />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Cliques totais"
              total={2}
              icon="ant-design:eye-filled"
            />
          </Grid>

          {/* <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="New Users"
              total={1352831}
              color="info"
              icon="ant-design:apple-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Item Orders"
              total={1723315}
              color="warning"
              icon="ant-design:windows-filled"
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Bug Reports"
              total={234}
              color="error"
              icon="ant-design:bug-filled"
            />
          </Grid> */}

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsWebsiteVisits
              title="Website Visits"
              subheader="(+43%) than last year"
              chart={{
                labels: [
                  '01/01/2003',
                  '02/01/2003',
                  '03/01/2003',
                  '04/01/2003',
                  '05/01/2003',
                  '06/01/2003',
                  '07/01/2003',
                  '08/01/2003',
                  '09/01/2003',
                  '10/01/2003',
                  '11/01/2003',
                ],
                series: [
                  {
                    name: 'Team A',
                    type: 'column',
                    fill: 'solid',
                    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                  },
                  {
                    name: 'Team B',
                    type: 'area',
                    fill: 'gradient',
                    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                  },
                  {
                    name: 'Team C',
                    type: 'line',
                    fill: 'solid',
                    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                  },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentVisits
              title="Current Visits"
              chart={{
                series: [
                  { label: 'America', value: 4344 },
                  { label: 'Asia', value: 5435 },
                  { label: 'Europe', value: 1443 },
                  { label: 'Africa', value: 4443 },
                ],
                colors: [
                  theme.palette.primary.main,
                  theme.palette.info.main,
                  theme.palette.error.main,
                  theme.palette.warning.main,
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Conversion Rates"
              subheader="(+43%) than last year"
              chart={{
                series: [
                  { label: 'Italy', value: 400 },
                  { label: 'Japan', value: 430 },
                  { label: 'China', value: 448 },
                  { label: 'Canada', value: 470 },
                  { label: 'France', value: 540 },
                  { label: 'Germany', value: 580 },
                  { label: 'South Korea', value: 690 },
                  { label: 'Netherlands', value: 1100 },
                  { label: 'United States', value: 1200 },
                  { label: 'United Kingdom', value: 1380 },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsCurrentSubject
              title="Current Subject"
              chart={{
                categories: ['English', 'History', 'Physics', 'Geography', 'Chinese', 'Math'],
                series: [
                  { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                  { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                  { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                ],
              }}
            />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsNewsUpdate title="News Update" list={_analyticPost} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AnalyticsTasks
              title="Tasks"
              list={[
                { id: '1', label: 'Create FireStone Logo' },
                { id: '2', label: 'Add SCSS and JS files if required' },
                { id: '3', label: 'Stakeholder Meeting' },
                { id: '4', label: 'Scoping & Estimations' },
                { id: '5', label: 'Sprint Showcase' },
              ]}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
