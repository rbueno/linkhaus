import * as Yup from 'yup';
import { useCallback, useEffect, useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Grid, Card, Stack, Typography, Button } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// utils
import { fData } from '../../../../utils/formatNumber';
// assets
import { countries } from '../../../../assets/data';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../../components/hook-form';
import api from '../../../../utils/axios'

// ----------------------------------------------------------------------

export default function MyPageAvatar() {
  const { enqueueSnackbar } = useSnackbar();

  const { user, currentWorkspace, updateWorkspaces } = useAuthContext();
  const [avatarFile, setAvatarFile] = useState(null)
  const [updatingAvatarFile, setUpdatingAvatarFile] = useState(false)
  const [myPage, setMyPage] = useState(currentWorkspace.myPage)


  const UpdateUserSchema = Yup.object().shape({
    // displayName: Yup.string().required('Name is required'),
    // email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    photoURL: Yup.string().required('Avatar is required').nullable(true),
    // phoneNumber: Yup.string().required('Phone number is required'),
    // country: Yup.string().required('Country is required'),
    // address: Yup.string().required('Address is required'),
    // state: Yup.string().required('State is required'),
    // city: Yup.string().required('City is required'),
    // zipCode: Yup.string().required('Zip code is required'),
    // about: Yup.string().required('About is required'),
  });

  const defaultValues = {
    // displayName: user?.displayName || '',
    // email: user?.email || '',
    photoURL: myPage.avatarURL || null,
    // phoneNumber: user?.phoneNumber || '',
    // country: user?.country || '',
    // address: user?.address || '',
    // state: user?.state || '',
    // city: user?.city || '',
    // zipCode: user?.zipCode || '',
    // about: user?.about || '',
    // isPublic: user?.isPublic || false,
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
    getValues
  } = methods;

 
  const onSubmit = async (prop) => {
    setUpdatingAvatarFile(true)
    const imageFile = avatarFile
    console.log('imageFile', imageFile)

    const { _id: myPageId, s3BucketDir} = myPage

    const imgData = new FormData();
    imgData.append('avatar', imageFile);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data } = await api.patch(`v1/mypage/avatar/${s3BucketDir}/${myPageId}`, imgData)
      console.log('avatar update', data)

      updateWorkspaces(data.workspaceSession)
      enqueueSnackbar('Update success!');
    } catch (error) {
      console.error(error);
    }

    setAvatarFile(null)
    setUpdatingAvatarFile(false)

  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        console.log('newFile', newFile)
        setValue('photoURL', newFile, { shouldValidate: true });
        setAvatarFile(file)
      }
    },
    [setValue]
  );

  useEffect(() => {
    // if(currentWorkspace) {
    //   setMyPage(currentWorkspace)
    // }
    console.log('currentWorkspace.myPage.avatarURL', currentWorkspace.myPage.avatarURL)
    setValue('photoURL', currentWorkspace.myPage.avatarURL || null, { shouldValidate: true });
  }, [currentWorkspace, setValue])

  const handleAvatar = async (e) => {
    const imageFile = e.target.files[0];
    console.log('====> do input imageFile', imageFile)

    const { _id: myPageId, s3BucketDir} = myPage

    const imgData = new FormData();
    imgData.append('avatar', imageFile);

    try {
      // const result = await api('PATCH', `/business/${editingBusiness.businessName}/update/avatar`, imgData);
      // const { data } = await api.patch(`v1/mypage/avatar/${s3BucketDir}/${myPageId}`, imgData)

      // console.log('avatar update', data)
      // updateWorkspaces(data.workspaceSession)
    } catch (error) {

      console.log(error.message);
      // throw new Error(`Erro ao atualizar imagem ${error}`);
    }

  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {console.log('myPage.avatarUR', myPage.avatarURL)}
            <RHFUploadAvatar
              name="photoURL"
              maxSize={3145728}
              onDrop={handleDrop}
              // helperText={
              //   <Typography
              //     variant="caption"
              //     sx={{
              //       mt: 2,
              //       mx: 'auto',
              //       display: 'block',
              //       textAlign: 'center',
              //       color: 'text.secondary',
              //     }}
              //   >
              //     Permitido *.jpeg, *.jpg, *.png, *.gif
              //     <br /> max size of {fData(3145728)}
              //   </Typography>
              // }
            />
            {
              avatarFile && <Stack spacing={2} mt={2}>
              <LoadingButton variant='contained' color="success" loading={updatingAvatarFile} type="submit">Atualizar Avatar</LoadingButton>
              <Button variant='outlined' color='error' onClick={() => setAvatarFile(null)}>Cancelar</Button>
            </Stack>
            }
      {/* <input type="file" id="logo" accept="image/jpg, image/jpeg, image/png, image/gif, image/bmp" onChange={handleAvatar} /> */}
    </FormProvider>
  );
}
