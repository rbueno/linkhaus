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
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, TextField, FormGroup } from '@mui/material';
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

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  editingWorkspace: PropTypes.object,
};

export default function UserNewEditForm({ isEdit = false, editingWorkspace }) {
  console.log('== editingWorkspace >', editingWorkspace)
  const { push } = useRouter();
  const { updateWorkspaces, switchWorkspace } = useAuthContext()
  const { enqueueSnackbar } = useSnackbar();

  const [newBusinessName, setNewBusinessName] = useState('');
  const [newBusinessNameError, setNewBusinessNameError] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const NewUserSchema = Yup.object().shape({
    company: Yup.string().required('Nome do negócio é obrigatório'),
    email: Yup.string().email('Formato inválido'),
    whatsapp: Yup.string(),
    // name: Yup.string().required('Name is required'),
    // address: Yup.string().required('Address is required'),
    // country: Yup.string().required('country is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // role: Yup.string().required('Role Number is required'),
    // avatarUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  });

  const defaultValues = useMemo(
    () => ({
      company: editingWorkspace?.businessId.name || '',
      email: editingWorkspace?.businessId.email || '',
      whatsapp: editingWorkspace?.businessId.whatsapp || '',
      phoneNumber: editingWorkspace?.businessId.phoneNumber || '',
      // name: currentUser?.name || '',
      // address: currentUser?.address || '',
      // country: currentUser?.country || '',
      // state: currentUser?.state || '',
      // city: currentUser?.city || '',
      // zipCode: currentUser?.zipCode || '',
      // avatarUrl: currentUser?.avatarUrl || '',
      // isVerified: currentUser?.isVerified || true,
      // status: currentUser?.status,
      // role: currentUser?.role || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [editingWorkspace]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (isEdit && editingWorkspace) {
      setDisplayName(editingWorkspace?.businessId.name)
      setNewBusinessName(editingWorkspace?.businessId.slug)
    }
    if (isEdit && editingWorkspace) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, editingWorkspace]);

  const onSubmit = async () => {
    setSubmitting(true)
    const payload ={
      company: newBusinessName,
      slug: newBusinessName,
      editingWorkspaceId: isEdit && editingWorkspace._id
    }
    console.log('onSubmit payload', payload)
    try {
      const response = isEdit ? await api.put('v1/business', payload) : await api.post('v1/business', payload)
      const { workspaceSession } = response.data
      console.log(`${ isEdit ? 'edited workspace' : 'created workspace'}`, workspaceSession)
      // updateWorkspaces(workspaceSession)
      switchWorkspace(workspaceSession.currentWorkspace?._id)
      reset();
      enqueueSnackbar(isEdit ? 'Mudança concluída' : 'Novo link criado');
      setSubmitting(false)
      push(PATH_DASHBOARD.mypage.main);
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
      setSubmitting(false)
    }
  };

  const alphanumeric = /^[-0-9a-zA-Z]+$/;

  const HandleSlugField = (e) => {
    if (e.length > 70) return;
    const slug = slugify(e);
    slug.match(alphanumeric) ? (
      setNewBusinessName(slug.toLowerCase()),
      setNewBusinessNameError(null)
    ) : (
      setNewBusinessNameError('Caractere não permitido. Utilize apenas letras e números!'),
      setNewBusinessName(slug)
    );
  };

  const handleBusinessDisplayName = (name) => {
    if (name.length > 60) return;
    setDisplayName(name);
    HandleSlugField(name.trim());
  };

  return (




       <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
             <Box
              sx={{
                display: 'grid',
                columnGap: 1,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
              }}
            >
              
              {
                isEdit && <Box m={2}>
                <Typography variant="h6" component="h6">Editando {editingWorkspace?.businessId.slug}</Typography>
                {/* <Typography variant="h6" component="h6">Editar Nome do seu negócio / ou nome comercial</Typography> */}
                <Typography variant="subtitle1" component="h6">Você poderá alterá-lo depois.</Typography>
              </Box>
              }
              {
                !isEdit && <Box m={2}>
                <Typography variant="h6" component="h6">Crie o link do seu negócio, perfil ou projeto</Typography>
                <Typography variant="subtitle1" component="h6">Você poderá alterá-los depois.</Typography>
              </Box>
              }
                  {/* <Box>
                    <FormGroup>
                      <TextField
                        label="Nome"
                        value={displayName}
                        color="primary"
                        placeholder="Ex.: Linkhaus"
                        // error={newBusinessNameError !== null}
                        onChange={(e) => handleBusinessDisplayName(e.target.value)}
                      />
                    </FormGroup>
                  </Box> */}

                  <Box>
                    {/* <FormGroup> */}
                    <Box display='flex' flexDirection='column'>

                    {/* <Typography sx={{ mr: 1 }}>Link demonstração:</Typography> */}
                    {/* <Box display='flex' flexDirection='row' m={2}> */}
                    <p style={{ fontSize: '12px'}}>https://<strong><span style={{ fontSize: '16px'}}>{newBusinessName || 'seu-nome-aqui'}</span></strong>.linkhaus.app</p>

                    {/* </Box> */}
                    {/* <Typography variant="body2" component="p">
                        
                      </Typography> */}
                    {/* <Typography variant="subtitle2" component="p">
                        {newBusinessName || 'seu-nome-aqui'}
                      </Typography>
                    <Typography variant="body2" component="p">
                        .linkhaus.app
                      </Typography> */}
                    </Box>
                      <TextField
                      fullWidth
                        label="Seu link"
                        value={newBusinessName}
                        color="primary"
                        placeholder="Ex.: linkhaus"
                        error={newBusinessNameError !== null}
                        helperText={newBusinessNameError || 'Este é o link que você irá compartilhar em redes sociais e outros canais.'}
                        onChange={(e) => HandleSlugField(e.target.value)}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        // }}
                      />
                    {/* </FormGroup> */}
                  </Box>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmit()} variant="contained" loading={submitting}>
                {!isEdit ? 'Criar link' : 'Salvar mudança'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
                 
    // <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    //   <Grid container spacing={3}>
        

    //     <Grid item xs={12} md={8}>
    //       <Card sx={{ p: 3 }}>
    //         <Box
    //           sx={{
    //             display: 'grid',
    //             columnGap: 1,
    //             rowGap: 3,
    //             gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(1, 1fr)' },
    //           }}
    //         >
              
    //           <RHFTextField name="company" label="Nome do negócio / nome comercial" />
              
    //           {/* <RHFTextField name="email" label="Email do negócio" />
    //           <RHFTextField name="whatsapp" label="WhatsApp do negócio" placeholder="Ex.: 5511984655006" />
    //           <Typography variant="body2">Apenas números sem espaço com (código do país) + (código de área) + (número do telefone)</Typography>
    //           <RHFTextField name="phoneNumber" label="Phone Number" /> */}

    //           {/* <RHFSelect name="country" label="Country" placeholder="Country">
    //             <option value="" />
    //             {countries.map((option) => (
    //               <option key={option.code} value={option.label}>
    //                 {option.label}
    //               </option>
    //             ))}
    //           </RHFSelect>

    //           <RHFTextField name="state" label="State/Region" />
    //           <RHFTextField name="city" label="City" />
    //           <RHFTextField name="address" label="Address" />
    //           <RHFTextField name="zipCode" label="Zip/Code" />
    //           <RHFTextField name="role" label="Role" /> */}
    //         </Box>

    //         <Stack alignItems="flex-end" sx={{ mt: 3 }}>
    //           <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
    //             {!isEdit ? 'Criar negócio' : 'Salvar mudança'}
    //           </LoadingButton>
    //         </Stack>
    //       </Card>
    //     </Grid>
    //   </Grid>
    // </FormProvider>
  );
}
