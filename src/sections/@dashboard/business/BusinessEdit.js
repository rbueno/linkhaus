/* eslint-disable no-unused-expressions */
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// next
import { useRouter } from 'next/router';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Container, Stack, Switch, Typography, FormControlLabel, TextField, FormGroup } from '@mui/material';
// utils
// import { fData } from '../../../utils/formatNumber';
import api from '../../../utils/axios';
import slugify from '../../../utils/slugify';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
// import { countries } from '../../../_mock';
// components
// import Label from '../../../components/Label';
import FormProvider, { RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import { useAuthContext } from '../../../auth/useAuthContext'


// ----------------------------------------------------------------------

BusinessEdit.propTypes = {
  editingWorkspace: PropTypes.object,
};

export default function BusinessEdit({ editingWorkspace }) {
  const { push } = useRouter();
  const { updateWorkspaces, switchWorkspace } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();

  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessNameError, setNewBusinessNameError] = useState(null);

  const [displayName, setDisplayName] = useState('');
  const [displayNameError, setDisplayNameError] = useState(null);

  // const [description, setDescription] = useState('');
  // const [descriptionError, setDescriptionError] = useState(null);

  const [data, setData] = useState({ name: '', slug: '', description: '' });
  const [dataError, setDataError] = useState({ name: null, slug: null, description: null });
  const [submitting, setSubmitting] = useState({ name: false, slug: false, description: false });

  useEffect(() => {
    if (editingWorkspace) {
      setDisplayName(editingWorkspace?.businessId.name)
      setNewBusinessName(editingWorkspace?.businessId.slug)

      setData({ name: editingWorkspace?.businessId.name, slug: editingWorkspace?.businessId.slug, description: editingWorkspace?.businessId.description || '' })
    }
  }, [editingWorkspace]);

  const onSubmitBusinessName = async () => {
    setSubmitting({
      ...submitting,
      name: true
    })
    const payload ={
      businessName: data.name,
    }

    try {
      const response = await api.put('v1/business/name', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmitting({
      ...submitting,
      name: false
    })
  };
  const onSubmitBusinessSlug = async () => {
    setSubmitting({
      ...submitting,
      slug: true
    })
    const payload ={
      slug: data.slug,
    }

    try {
      const response = await api.put('v1/business/slug', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }

    setSubmitting({
      ...submitting,
      slug: false
    })
  };
  const onSubmitBusinessDescription = async () => {
    setSubmitting({
      ...submitting,
      description: true
    })
    const payload ={
      businessDescription: data.description,
    }

    try {
      const response = await api.put('v1/business/description', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmitting({
      ...submitting,
      description: false
    })
  };

  const alphanumeric = /^[-0-9a-zA-Z]+$/;

  const HandleSlugField = (e) => {
    if (e.length > 70) return;
    const slug = slugify(e);
    slug.match(alphanumeric) ? (
      // setNewBusinessName(slug.toLowerCase()),
      // setNewBusinessNameError(null),

      setData({
        ...data,
        slug: slug.toLowerCase()
      }),

      setDataError({
        ...dataError,
        slug: null
      })
    ) : (
      // setNewBusinessNameError('Caractere não permitido. Utilize apenas letras e números!'),
      // setNewBusinessName(slug),

      setData({
        ...data,
        slug
      }),

      setDataError({
        ...dataError,
        slug: 'Caractere não permitido. Utilize apenas letras e números!'
      })
    );
  };

  const handleBusinessDisplayName = (name) => {
    if (name.length > 60) return;
    // setDisplayName(name);
    setData({
      ...data,
      name
    })
    // HandleSlugField(name.trim());
  };
  const handleBusinessDescrilption = (description) => {
    if (description.length > 360) return;
    // setDisplayName(name);
    setData({
      ...data,
      description
    })
    // HandleSlugField(name.trim());
  };

  const handleFinshEdition = () => {
    // push(PATH_DASHBOARD.mypage.main);
    console.log('edição concluída')
  }

  return (




      <Container>
        {/* <Typography variant="h6" component="h6">{editingWorkspace?.businessId.slug}</Typography> */}
          <Box mb={2}>
          <Card sx={{ p: 3 }}>
             <Box
              sx={{
                display: 'grid',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              
                  <Box>
                    <FormGroup>
                      <TextField
                        label="Nome"
                        value={data.name}
                        color="primary"
                        placeholder="Ex.: Linkhaus"
                        // error={newBusinessNameError !== null}
                        onChange={(e) => handleBusinessDisplayName(e.target.value)}
                      />
                    </FormGroup>
                  </Box>

                  
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessName()} variant="contained" loading={submitting.name}>
                Atualizar
              </LoadingButton>
            </Stack>
          </Card>
          </Box>


          <Box mb={2}>
          <Card sx={{ p: 3 }}>
             <Box
              sx={{
                display: 'grid',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              
                  
                  <Box>
                    {/* <FormGroup> */}
                    <Box display='flex' flexDirection='column'>

                    <Typography sx={{ mr: 1 }}>Link:</Typography>
                    <p style={{ fontSize: '12px'}}>https://<strong><span style={{ fontSize: '16px'}}>{newBusinessName || 'meu-negocio'}</span></strong>.linkhaus.app</p>
                    </Box>
                      <TextField
                      fullWidth
                        label="Link de compartilhamento"
                        value={data.slug}
                        color="primary"
                        placeholder="Ex.: linkhaus"
                        error={dataError.slug !== null}
                        helperText={dataError.slug && dataError.slug}
                        onChange={(e) => HandleSlugField(e.target.value)}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        // }}
                      />
                    {/* </FormGroup> */}
                  </Box>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessSlug()} variant="contained" loading={submitting.slug}>
                Atualizar
              </LoadingButton>
            </Stack>
          </Card>
          </Box>


          <Box mb={2}>
          <Card sx={{ p: 3 }}>
             <Box
              sx={{
                display: 'grid',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              

                  <Box>
                    {/* <FormGroup> */}
                   
                      <TextField
                      fullWidth
                      multiline
                      rows={6}
                        label="Descrição / bio"
                        value={data.description}
                        color="primary"
                        placeholder="Ex.: Sobre a sua empresa ou sobre o seu perfil"
                        error={dataError.description !== null}
                        helperText={dataError.description && dataError.description}
                        onChange={(e) => handleBusinessDescrilption(e.target.value)}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        // }}
                      />
                    {/* </FormGroup> */}
                  </Box>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessDescription()} variant="contained" loading={submitting.description}>
                Atualizar
              </LoadingButton>
            </Stack>
          </Card>
          </Box>

          <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => handleFinshEdition()} variant="contained" loading={submitting.description}>
                Finalizar edição
              </LoadingButton>
            </Stack>
      </Container>
  );
}
