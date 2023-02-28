// next
import Head from 'next/head';
// @mui

import { Grid, Container, Typography, Box, TextField, Stack, MenuItem } from '@mui/material';

// layouts
import DashboardLayout from '../../layouts/dashboard';
// _mock_

// ----------------------------------------------------------------------

GeneralBookingPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
export default function GeneralBookingPage() {
  
  return (
    <>
      <Head>
        <title> Métricas | Linkhaus </title>
      </Head>

      <Container >
        <Typography>Agora tem que abrir kkk</Typography>
      </Container>
    </>
  );
}
