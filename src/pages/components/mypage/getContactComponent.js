import { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import * as Yup from 'yup'
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import { alpha, useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Button, InputBase, Tabs, Tab, TextField, Alert, AlertTitle, Grid, Card } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { bgGradient } from '../../../utils/cssStyles';
import localStorageAvailable from '../../../utils/localStorageAvailable';
import { useSnackbar } from '../../../components/snackbar'
import FormProvider, { RHFTextField } from '../../../components/hook-form'

// ----------------------------------------------------------------------


GetContactComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  businessSlug: PropTypes.string,
  businessId: PropTypes.string,
  pageId: PropTypes.string,
  eventEntry: PropTypes.func,
  component: PropTypes.object,
};

export default function GetContactComponent({ title, description, businessSlug, businessId, eventEntry, pageId, component }) {
  const theme = useTheme();
  const [currentTab, setCurrentTab] = useState('email');
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState({ email: null, sms: null, whatsapp: null });
  const { enqueueSnackbar } = useSnackbar()

  const storageAvailable = localStorageAvailable();

  const UpdateUserSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  });

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const updateLocalSubscriptionConfig = (subscriptionConfig) => {
    setIsSubscribed(subscriptionConfig)
    if (storageAvailable) localStorage.setItem('subscriptionConfig', JSON.stringify(subscriptionConfig))

  }

    useEffect(() => {
    if (storageAvailable) {
      const localStorageSubscriptionConfig = localStorage.getItem('subscriptionConfig')
      console.log('localStorageSubscriptionConfig', localStorageSubscriptionConfig)
      const subscriptionConfig = localStorageSubscriptionConfig ? JSON.parse(localStorageSubscriptionConfig) : null
      console.log('subscriptionConfig', subscriptionConfig)
      updateLocalSubscriptionConfig(subscriptionConfig || isSubscribed)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageAvailable]);

  const submitEmailSubscription = async (data) => {

    // try {
    //   await new Promise((resolve) => setTimeout(resolve, 500));
    //   enqueueSnackbar('Update success!');
    //   console.log('DATA', data);
    // } catch (error) {
    //   console.error(error);
    // }
    // const businessSlug = localStorage.getItem('businessSlug') || businessSlug
    
    // if (!businessSlug) {
    //   enqueueSnackbar('Erro desconhecido. Contate o suporte!', { variant: 'error'})
    //   return
    // }

    const payload = {
      businessSlug,
      businessId,
      type: 'email',
      data: data.email
    }

    try {
      let result = {}
      let statusCode = 0

      if(businessSlug === 'fake_slug') {
        result = { message: 'Sucesso', data: { _id: '123' }}
        statusCode = 200
      } else {
        const response = await fetch('/api/subscribe/email/', {
          method: 'POST',
          body: JSON.stringify(payload),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        result = await response.json()
        statusCode = await response.status

        eventEntry({ component, eventType: 'subscribe', data: { businessId, _id: pageId } })
      }

      if(statusCode === 200) {
        enqueueSnackbar(result.message || 'Sucesso', { variant: 'success'})
        updateLocalSubscriptionConfig({ ...isSubscribed, email: result.data._id })
        return
      }
      
      
      if(statusCode === 400 && result.message.includes('duplicado')) {
        enqueueSnackbar(result.message || 'Erro desconhecido', { variant: 'error'})
        updateLocalSubscriptionConfig({ ...isSubscribed, email: result.data._id })
        return
      }
      
      if(statusCode !== 200) {
        enqueueSnackbar(result.message || 'Erro desconhecido', { variant: 'error'})
        return
      }

    } catch (error) {
      console.log('deu erro', error)
    }
  }
  const removeEmailSubscription = async (type = 'email') => {
    setIsRemoving(true)
    const payload = {
      data: isSubscribed[type]
  }

    try {
      let result = {}
      let statusCode = 0
      
      if(businessSlug === 'fake_slug') {
        result = { message: 'Sucesso', data: { _id: '123' }}
        statusCode = 200
      } else {
        const response = await fetch('/api/subscribe/email/', {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        result = await response.json()
        statusCode = await response.status
      }

      if(statusCode === 200) {
        enqueueSnackbar(result.message || 'Sucesso', { variant: 'success'})
        updateLocalSubscriptionConfig({ ...isSubscribed, email: null })
      }
      
      if(statusCode !== 200) {
        enqueueSnackbar(result.message || 'Erro desconhecido', { variant: 'error'})
      }
    } catch (error) {
      console.log('deu erro', error)
    }
    setIsRemoving(false)
  }

  const TABS = [
    {
      value: 'email',
      label: 'Email',
      icon: <EmailIcon />,
      componentSubscribed: <Alert
      severity="success">
        <AlertTitle>Cadastro já realizado!</AlertTitle>
        <p><LoadingButton size="small" loading={isRemoving} onClick={() => removeEmailSubscription()}>Clique aqui</LoadingButton> para descadastrar.</p>
      </Alert>,
    //   componentSubscribe: <InputBase
    //   value={inputEmail}
    //   fullWidth
    //   placeholder="Informe o Seu email aqui"
    //   onChange={(e) => setInputEmail(e.target.value)}
    //   sx={{
    //     mt: 1,
    //     px: 1.5,
    //     height: 40,
    //     borderRadius: 1,
    //     color: 'common.white',
    //     bgcolor: alpha(theme.palette.common.black, 0.26),
    //     '&::placeholder': {
    //       color: alpha(theme.palette.common.white, 0.48),
    //     },
    //   }}
    // />,
      componentSubscribe:<FormProvider methods={methods} onSubmit={handleSubmit(submitEmailSubscription)}>
      {/* <Grid container spacing={3}> */}
      <RHFTextField
        name="email"
        label="Informe o seu email"
        sx={{
        // mt: 1,
        // px: 1.5,
        // height: 40,
        borderRadius: 1,
        color: 'common.white',
        bgcolor: alpha(theme.palette.common.black, 0.26),
        '&::placeholder': {
          color: alpha(theme.palette.common.white, 0.48),
        },
      }}
      />
      <Stack sx={{ mt: 1 }}>
              <LoadingButton
                fullWidth
                type="submit"
                variant="contained"
                loading={isSubmitting}
                sx={{ backgroundColor: theme.palette.common.black }}
              >
                Cadastrar
              </LoadingButton>
            </Stack>
      {/* </Grid> */}

      {/* <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                sx={{ backgroundColor: theme.palette.common.black }}
                // color={theme.palette.primary.dark}
                variant="contained"
                onClick={() => submitEmailSubscription()}
                >
                Cadastrar
              </Button>
            </Box> */}
    </FormProvider>,
    },
    {
      value: 'whatsapp',
      label: 'WhatsApp',
      icon: <WhatsAppIcon />,
      componentSubscribed: <>Já inscrito</>,
      componentSubscribe: <InputBase
      fullWidth
      placeholder="Seu WhatsApp Aqui"
      sx={{
        mt: 1,
        px: 1.5,
        height: 40,
        borderRadius: 1,
        color: 'common.white',
        bgcolor: alpha(theme.palette.common.black, 0.16),
        '&::placeholder': {
          color: alpha(theme.palette.common.white, 0.48),
        },
      }}
    />,
    },
    {
      value: 'sms',
      label: 'SMS',
      icon: <EmailIcon />,
      componentSubscribed: <>Já inscrito</>,
      componentSubscribe: <InputBase
      fullWidth
      placeholder="Seu número aqui"
      sx={{
        mt: 1,
        px: 1.5,
        height: 40,
        borderRadius: 1,
        color: 'common.white',
        bgcolor: alpha(theme.palette.common.black, 0.16),
        '&::placeholder': {
          color: alpha(theme.palette.common.white, 0.48),
        },
      }}
    />,
    },

    
  
   
  ];

  return (
      <Box
        sx={{
          // mt: -15,
          color: 'common.white',
          borderRadius: 2,
          p: theme.spacing(5, 2, 5, 2),
          ...bgGradient({
            direction: '135deg',
            startColor: theme.palette.primary.main,
            endColor: theme.palette.primary.dark,
          }),
        }}
      >
        <Box display='flex' flexDirection='column' textAlign='center' sx={{ mb: 2 }}>
            <Typography variant="h6" >
              {title}
            </Typography>
      

          <Typography variant="body2" >
            {description}
          </Typography>
        </Box>
        {/* <InputBase
              fullWidth
              placeholder="Nome Completo"
              sx={{
                mb: 2,
                px: 1.5,
                height: 40,
                borderRadius: 1,
                color: 'common.white',
                bgcolor: alpha(theme.palette.common.black, 0.16),
                '&::placeholder': {
                  color: alpha(theme.palette.common.white, 0.48),
                },
              }}
            /> */}

              <Box>
              {/* <Tabs
                  value={currentTab}
                  onChange={(event, newValue) => setCurrentTab(newValue)}
                  color='common.white'
                  sx={{
                    width: 1,
                    bottom: 0,
                  }}
                >
                  {TABS.map((tab) => (
                    <Tab sx={{ color: 'common.white' }} color='common.white' key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
                  ))}
                </Tabs> */}

                {TABS.map(
                    (tab) => tab.value === currentTab && <Box key={tab.value}>
                    {
                      isSubscribed[tab.value] ? tab.componentSubscribed : tab.componentSubscribe
                    }
                    
                    </Box>
                  )}

                

              </Box>
            {/* <InputBase
              fullWidth
              placeholder="Email"
              sx={{
                px: 1.5,
                height: 40,
                borderRadius: 1,
                color: 'common.white',
                bgcolor: alpha(theme.palette.common.black, 0.16),
                '&::placeholder': {
                  color: alpha(theme.palette.common.white, 0.48),
                },
              }}
            /> */}


          {/* <Box sx={{ mt: 2 }}>
            <Button
              fullWidth
              sx={{ backgroundColor: theme.palette.common.black }}
              // color={theme.palette.primary.dark}
              variant="contained"
              onClick={() => submitEmailSubscription()}
              >
              Cadastrar
            </Button>
          </Box> */}

        {/* <Stack direction="row" spacing={1}>
        </Stack> */}
      </Box>
  );
}
