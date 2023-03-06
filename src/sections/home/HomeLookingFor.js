import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Container, Typography, Grid, Stack } from '@mui/material';
// hooks
import useResponsive from '../../hooks/useResponsive';
// routes
import { PATH_ZONE_ON_STORE } from '../../routes/paths';
// components
import Image from '../../components/image';
import Iconify from '../../components/iconify';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  padding: theme.spacing(5, 0),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(2, 0),
  },
}));

// ----------------------------------------------------------------------

export default function HomeLookingFor() {
  const isDesktop = useResponsive('up', 'md');

  return (
    <StyledRoot>
      <Container component={MotionViewport}>
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          spacing={{ xs: 5, md: 0 }}
        >
          {
            isDesktop && <><Grid item xs={12} md={4}>
            <Description />
          </Grid>

          <Grid item xs={12} md={7}>
            <Content />
          </Grid></>
          }

          {
            !isDesktop && <><Grid item xs={12} md={7}>
            <Content />
          </Grid>
          <Grid item xs={12} md={4}>
            <Description />
          </Grid>

          
          </>
          }
          {/* {!isDesktop && (
            <Grid item xs={12} sx={{ textAlign: 'center' }}>
              {VisitButton}
            </Grid>
          )} */}
        </Grid>
      </Container>
    </StyledRoot>
  );
}

// ----------------------------------------------------------------------

function Description() {
  const isDesktop = useResponsive('up', 'md');

  return (
    <Stack
      sx={{
        textAlign: {
          xs: 'center',
          md: 'left',
        },
      }}
    >
      <m.div variants={varFade().inDown}>
      <Typography variant="h2" sx={{ my: 3 }}>
      Captura e gestão de leads
        </Typography>
      </m.div>

      <m.div variants={varFade().inDown}>
      <Typography
          sx={{
            mb: 5,
            color: 'text.secondary',
          }}
        >
          Não deixe o seu negócio ficar refém dos algoritmos das redes sociais que vez ou outra podem derrubar o seu alcance. Utilize nosso recurso de captura e gestão de leads para construir a sua base própria com contatos de seus seguidores.
        </Typography>
      </m.div>

      {/* {isDesktop && <m.div variants={varFade().inDown}> {VisitButton} </m.div>} */}
    </Stack>
  );
}

// ----------------------------------------------------------------------

function Content() {
  return (
    <Box component={m.div} variants={varFade().inUp}>
      <Image disabledEffect alt="rocket" src="/assets/images/home/linkhaus_okahub_01_captura_gestao_leads.jpg" />
    </Box>
  );
}

const VisitButton = (
  <Button
    color="inherit"
    size="large"
    variant="outlined"
    target="_blank"
    rel="noopener"
    href={PATH_ZONE_ON_STORE}
    endIcon={<Iconify icon="ic:round-arrow-right-alt" />}
  >
    Visit Zone Landing Page
  </Button>
);
