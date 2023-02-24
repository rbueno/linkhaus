import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import api from '../../../../utils/axios'

// ----------------------------------------------------------------------

export default function AccountChangePassword() {
  const { enqueueSnackbar } = useSnackbar();

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Senha atual é obrigatória'),
    newPassword: Yup.string()
      .min(6, 'Senha precisa ter 6 caracteres no mínimo')
      .required('A nova senha é obrigatória'),
    confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
  });

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (submitData) => {
    try {
      console.log('DATA', submitData);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      const { data } = await api.put('/v1/account', submitData)
      console.log('data.workspaceSession', data.workspaceSession)
      reset();
      enqueueSnackbar('Senha atualizada!');
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <Stack spacing={3} alignItems="flex-end" sx={{ p: 3 }}>
          <RHFTextField name="oldPassword" type="password" label="Senha atual" />

          <RHFTextField
            name="newPassword"
            type="password"
            label="Nova senha"
            helperText={
              <Stack component="span" direction="row" alignItems="center">
                <Iconify icon="eva:info-fill" width={16} sx={{ mr: 0.5 }} /> A senha precisa ter 6 caracteres no mínimo
              </Stack>
            }
          />

          <RHFTextField name="confirmNewPassword" type="password" label="Confirmar nova senha" />

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Salvar nova senha
          </LoadingButton>
        </Stack>
      </Card>
    </FormProvider>
  );
}
