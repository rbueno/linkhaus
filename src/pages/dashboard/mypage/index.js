/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import getVideoId from 'get-video-id';
import Script from 'next/script'
// next
import Head from 'next/head';
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Tab, Tabs, Box, Typography, Button, Card, TextField, Stack, IconButton, Divider, Alert, AlertTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';

import { v4 as uuidv4 } from 'uuid'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import AppleIcon from '@mui/icons-material/Apple';
import ShopIcon from '@mui/icons-material/Shop';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ColorLensIcon from '@mui/icons-material/ColorLens';

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

import buildIcon, { findLinkConfigByIconId } from '../../../components/buildIcon';

// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock_
import { _userPayment, _userAddressBook, _userInvoices, _userAbout } from '../../../_mock/arrays';
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import Iconify from '../../../components/iconify';

import GetContactComponent from '../../components/mypage/getContactComponent';
import MapComponent from '../../components/mypage/mapComponent';
import YoutubeCardVideo from '../../components/mypage/youtubeCardVideo';

import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
import { useSnackbar } from '../../../components/snackbar';
// sections
import {
  AccountGeneral,
  AccountBilling,
  AccountSocialLinks,
  AccountNotifications,
  AccountChangePassword,
  MyPageAvatar
} from '../../../sections/@dashboard/mypage/account';
import EditBlockTitleDialog from '../../../sections/@dashboard/mypage/editBlockitemDialog/EditBlockTitleDialog'
import AppWelcome from '../../../sections/@dashboard/mypage/AppWelcome'

import { useAuthContext } from '../../../auth/useAuthContext'
import api from '../../../utils/axios'
import slugify from '../../../utils/slugify'
import localStorageAvailable from '../../../utils/localStorageAvailable'
import { bgGradient } from '../../../utils/cssStyles'
import ColorPresetsOptions from '../../../components/settings/drawer/ColorPresetsOptions'

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

MyPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------
const TABS = [
  {
    value: 'paragraph',
    label: 'Texto',
    icon: <Iconify icon="ic:round-receipt" />,
    component: <Box>Crie um texto livre com descrições e detalhes que enriqueçam seu conteúdo.</Box>,
  },
  {
    value: 'linkButton',
    label: 'Link',
    icon: <Iconify icon="eva:share-fill" />,
    component: <Box>Crie botões com links externos de, por exemplo, uma site de vendas ou redes sociais</Box>,
  },
  {
    value: 'getContacts',
    label: 'Captar contato',
    icon: <Iconify icon="ic:round-account-box" />,
    component: <Box>Capture contatos e tenha uma lista de leads qualificados.</Box>,
  },
  {
    value: 'youtubeCardVideo',
    label: 'Youtube',
    icon: <YouTubeIcon />,
    component: <Box>Destaque um vídeo de seu canal do Youtube.</Box>,
  },
  {
    value: 'googlemaps',
    label: 'Google Maps',
    icon: <Iconify icon="ic:round-vpn-key" />,
    component: <Box>Informe o seu endereço físico com um mapa super dinâmico</Box>,
  },
];

const availableThemeColorPresets = {
  default: 'default',
  cyan: 'cyan',
  purple: 'purple',
  blue: 'blue',
  orange: 'orange',
  red: 'red'
}

const buildComponent = ({component, theme, businessSlug, businessId, setSettingVisible, settingVisible, data }) => {
  const iconComponent = component?.props?.icon && buildIcon(component.props.icon)
  const componentDisplayName = () => TABS.find(item => item.value === component.type).label
  // <Button component={NextLink} href="/" size="large" variant="contained">
  //         Go to Home
  //       </Button>

  if (!component?.props) {
    return <Box
    fullWidth
      size="large"
      // variant="outlined"

      // onClick={() => setSettingVisible( settingVisible === component.componentId ? null : component.componentId )} disableRipple
    >
      {/* <Typography >Novo item adicionado</Typography>
      <Typography>tipo: {componentDisplayName()}</Typography> */}
      <Alert severity='success'>
                  <AlertTitle sx={{ textTransform: 'capitalize' }}> Novo item adicionado </AlertTitle>
                  tipo: {componentDisplayName()}
                </Alert>
      
    </Box>
  }
  if (component.type === 'linkButton') {
    return (
      <Button
      fullWidth
      {...(iconComponent ? { startIcon: iconComponent.iconComponent } : {})}
      //  startIcon={iconComponent.iconComponent}
          size="large"
          variant="contained"
          sx={{
            backgroundColor: component.props?.color || theme.palette.primary.main
          }}
          // component={NextLink}
          href={component.props.link}
          // href={PATH_DOCS.root} 
          target="_blank"
          rel="noopener" 
          // disabled={false}
          onClick={() => console.log('linkButton clicked test')}
          // disabled={props?.data?.Celular ? false : true}
          // onClick={() => handleWhatsAppClick(props.data.Celular)} disableRipple
          disableRipple
        >
          {component.props?.text}
      </Button>
    )
  }
  if (component.type === 'paragraph') {
    return (
      <Typography textAlign="center" variant="body2">{component.props?.text}</Typography>
    )
  }

  if (component.type === 'googlemaps') {
    return (
      <MapComponent
        lat={component.props.lat}
        lng={component.props.lng}
        url={component.props.url}
        placeTitle={component.props.name}
        placeAddress={component.props.formattedAddress}
        component={component}
        businessSlug={businessSlug}
        businessId={data.businessId}
        pageId={data._id}
      />
    )
  }

  if (component.type === 'getContacts') {
    return (
      <GetContactComponent
      price="$50"
      title={component.props?.title || 'Ative as notificações!'}
      description={component.props?.description || 'Cadastre-se e não perca nenhuma novidade importante.'}
      businessSlug={businessSlug}
      businessId={businessId}
      />
    )
  }
  if (component.type === 'youtubeCardVideo') {
    return (
      <YoutubeCardVideo
        title={component.props?.title}
        videoId={component.props?.videoId}
        subscriptionLink={component.subscriptionLink}
        subscriptionLinkLabel={component.subscriptionLinkLabel}
        businessSlug={businessSlug}
        businessId={data.businessId}
        pageId={data._id}
        component={component}
      />
    )
  }

  return <></>
}

// eslint-disable-next-line react/prop-types
const EditBlockTitle = ({ sectionId, title: currentTitle, saveItemEdition, isOpen, businessSlug }) => {
  const [title, setTitle] = useState(currentTitle)
  const [updatingTitle, setUpdatingTitle] = useState()
  const [deletingSection, setDeletingSection] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)

  const action = async () => {
    setUpdatingTitle(true)
    
    try {
      const { data } = await api.put(`v1/section/${sectionId}`, { title, businessSlug })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setUpdatingTitle(false)
  }
  const handleDelete = async () => {
    setDeletingSection(true)
    
    try {
      const { data } = await api.put(`v1/section/delete/${sectionId}`, { businessSlug })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingSection(false)
  }

  return (
    <>
    {
      !showDeleteComponent && <Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
      <TextField
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="Exemplo: Redes sociais"
          />

      </Box>
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingTitle} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>
    </Box>
    
    
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar essa seção juntamente com todos os componentes desta seção. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingSection}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}
const AddNewItem = ({ addComponent, isOpen }) => {
  const [currentTab, setCurrentTab] = useState('linkButton');
const [addingItem, setAddingItem] = useState(false)
  const action = async (componentValue) => {
    setAddingItem(true)
    try {
      await addComponent(componentValue)
    } catch (error) {
      console.log(error)
    }
    setAddingItem(false)
    isOpen(false)
  }
  

  return (
    <Box>
     <Box display='flex' alignItems='center' justifyContent='center' m={2}>
          <Typography variant='subtitle2'>Adicionar novo item nesta seção</Typography>

        </Box>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value}>
                <Box sx={{ mt: 2 }}>
                  {tab.component}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <LoadingButton loading={addingItem} variant='contained' onClick={() => action(tab.value)}>Adicionar {tab.label}</LoadingButton>
                </Box>
                </Box>
              )
          )}  
    </Box>
  )
}

// eslint-disable-next-line react/prop-types
const EditBlockLinkButton = ({ currentItemState, saveItemEdition, isOpen, businessSlug }) => {
  console.log('currentItemState', currentItemState)
  console.log('businessSlug', businessSlug)
  const [link, setLink] = useState(currentItemState.props?.link)
  const [label, setLabel] = useState(currentItemState.props?.text)
  const [icon, setIcon] = useState(currentItemState.props?.icon?.id || null)
  const [color, setColor] = useState(currentItemState.props?.color)
  const [updatingComponent, setUpdatingComponent] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)

  function formatLink(rawLink) {
    if(rawLink.startsWith('https://') || rawLink.startsWith('http://')) return rawLink
    
    return `http://${rawLink}`
  }
  const action = async () => {
    setUpdatingComponent(true)
    const linkConfigByIconId = findLinkConfigByIconId(link)

    const linkFormatted = formatLink(link)
    console.log('linkFormatted', linkFormatted)
    const payload = {
      componentId: currentItemState.componentId,
      businessSlug,
      sectionId: currentItemState.sectionId,
      type: currentItemState.type,
      props: {
        icon: {
          id: linkConfigByIconId.id,
          // props: { fontSize: 'small'},
        },
        text: label,
        color: linkConfigByIconId.color,
        link: linkFormatted
      }
    }
    console.log('payload', payload)
    
    try {
      const { data } = await api.put(`v1/component/${currentItemState.componentId}`, payload)
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    setUpdatingComponent(false)
    isOpen(false)
  }

  const handleDelete = async () => {
    setDeletingComponent(true)
    
    try {
      const { data } = await api.put(`v1/component/delete/${currentItemState.componentId}`, { businessSlug, sectionId: currentItemState.sectionId })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingComponent(false)
  }

  return (
    <>
    {
      !showDeleteComponent && <Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={link}
        onChange={(e) => setLink(e.target.value)}
        label="Exemplo: www.instagram.com/linkhaus.app"
        />

      </Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        label="Exemplo: Segue no Instagram"
        />

      </Box>
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingComponent} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>
    </Box>
    
    
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar este componente. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingComponent}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}
const EditYoutubeCardVideo = ({ currentItemState, saveItemEdition, isOpen, businessSlug }) => {
  console.log('currentItemState', currentItemState)
  console.log('businessSlug', businessSlug)
  const [videoLink, setVideoLink] = useState(currentItemState.props?.videoLink)
  const [title, setTitle] = useState(currentItemState.props?.title)
  const [videoId, setVideoId] = useState(currentItemState.props?.videoId)
  const [icon, setIcon] = useState(currentItemState.props?.icon?.id || null)
  const [color, setColor] = useState(currentItemState.props?.color)
  const [updatingComponent, setUpdatingComponent] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  
  

  const action = async () => {
    setUpdatingComponent(true)
    
    const videoData = getVideoId(videoLink || '');

    if(videoData.service !== 'youtube') {
      enqueueSnackbar('Youtube não identificado', { variant: 'error' });
      return
    }
    
    const payload = {
      componentId: currentItemState.componentId,
      businessSlug,
      sectionId: currentItemState.sectionId,
      type: currentItemState.type,
      props: {
        title,
        videoId: videoData.id,
        videoLink
        // subscriptionLink={component.subscriptionLink}
        // subscriptionLinkLabel={component.subscriptionLinkLabel}
        // channelLink={component.channelLink}
      }
    }
      console.log('payload', payload)
   
    try {
      const { data } = await api.put(`v1/component/${currentItemState.componentId}`, payload)
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    setUpdatingComponent(false)
    isOpen(false)
  }

  const handleDelete = async () => {
    setDeletingComponent(true)
    
    try {
      const { data } = await api.put(`v1/component/delete/${currentItemState.componentId}`, { businessSlug, sectionId: currentItemState.sectionId })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingComponent(false)
  }

  return (
    <>
    {
      !showDeleteComponent && <Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={videoLink}
        onChange={(e) => setVideoLink(e.target.value)}
        label="Link do vídeo"
        />

      </Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Título do vídeo"
        />

      </Box>
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingComponent} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>
    </Box>
    
    
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar este componente. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingComponent}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}
const EditGoogleMaps = ({ currentItemState, saveItemEdition, isOpen, businessSlug }) => {
  console.log('currentItemState', currentItemState)
  console.log('businessSlug', businessSlug)
  const [name, setName] = useState(currentItemState.props?.name)
  const [url, setURL] = useState(currentItemState.props?.url)
  const [cid, setCID] = useState(currentItemState.props?.cid)
  const [formattedAddress, setFormattedAddress] = useState(currentItemState.props?.formattedAddress)
  const [completeAddress, setCompleteAddress] = useState(currentItemState.props?.completeAddress)
  const [lat, setLAT] = useState(currentItemState.props?.lat)
  const [lng, setLNG] = useState(currentItemState.props?.lng)
  const [updatingComponent, setUpdatingComponent] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  
  const {
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
    init
  } = usePlacesAutocomplete({
    initOnMount: false,
    requestOptions: {
      /* Define search scope here */
    },
    debounce: 300,
  })
  

  const action = async () => {
    setUpdatingComponent(true)
    
    
    const payload = {
      componentId: currentItemState.componentId,
      businessSlug,
      sectionId: currentItemState.sectionId,
      type: currentItemState.type,
      props: {
        name,
        url,
        formattedAddress,
        completeAddress: value,
        lat,
        lng
        // subscriptionLink={component.subscriptionLink}
        // subscriptionLinkLabel={component.subscriptionLinkLabel}
        // channelLink={component.channelLink}
      }
    }
      console.log('payload', payload)
   
    try {
      const response = await api.put(`v1/component/${currentItemState.componentId}`, payload)
      saveItemEdition(response.data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    setUpdatingComponent(false)
    isOpen(false)
  }

  const handleDelete = async () => {
    setDeletingComponent(true)
    
    try {
      const response = await api.put(`v1/component/delete/${currentItemState.componentId}`, { businessSlug, sectionId: currentItemState.sectionId })
      saveItemEdition(response.data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingComponent(false)
  }

  const ref = useOnclickOutside(() => {
    // When user clicks outside of the component, we can dismiss
    // the searched suggestions by calling this method
    clearSuggestions();
  });

  const handleInput = (e) => {
    // Update the keyword of the input element
    setValue(e.target.value);
  };

  useEffect(() => {
    if (completeAddress) setValue(completeAddress)
  }, [completeAddress, setValue])

  const handleSelect =
    (suggestion) =>
    () => {
      // When user selects a place, we can replace the keyword without request data from API
      // by setting the second parameter to "false"
      setValue(suggestion.description, false);
      console.log('place id', suggestion.place_id)
      console.log('=== suggestion', suggestion)
      clearSuggestions();

      getDetails({ placeId: suggestion.place_id }).then(placeDetail => {
        setName(placeDetail.name)
        setURL(placeDetail.url)
        setFormattedAddress(placeDetail.formatted_address)
      })
      // Get latitude and longitude via utility functions
      getGeocode({ address: suggestion.description }).then((results) => {
        const geoCode = getLatLng(results[0]);
        setLAT(geoCode.lat)
        setLNG(geoCode.lng)
      });
    };

  const renderSuggestions = () =>
    data.map((suggestion) => {
      const {
        place_id,
        structured_formatting: { main_text, secondary_text },
      } = suggestion;

      return (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
        <li key={place_id} onClick={handleSelect(suggestion)}>
          <strong>{main_text}</strong> <small>{secondary_text}</small>
        </li>
      );
    });


    // useEffect(() => {
    //   console.log('mudou ready', ready)
    // }, [ready])

  return (
    <>
     <Head>
        
        {/* <Script async defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`} /> */}
        {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      /> */}
      </Head>

    {
      !showDeleteComponent && <Box>
        {/* <Script
        onLoad={() => function initMap() {
          console.log('entrou iniMap')
            }}
        /> */}
            
        {/* <Script defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`} /> */}
        <Script
        defer
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        strategy="lazyOnload"
        onReady={init}
      />
        {/* <div ref={ref}> */}
      {/* <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Where are you going?"
      /> */}
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {/* {status === "OK" && <ul>{renderSuggestions()}</ul>} */}
    {/* </div> */}
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={value}
        onChange={handleInput}
        label="Nome do negócio ou endereço"
        />

      {status === "OK" && <ul>{renderSuggestions()}</ul>}
      </Box>
      {/* <Box sx={{ paddingTop: 1, paddingBottom: 1 }}> */}
        {/* <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Título do vídeo"
        /> */}

      {/* </Box> */}
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingComponent} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>




    </Box>
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar este componente. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingComponent}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}

const EditGetContacts = ({ currentItemState, saveItemEdition, isOpen, businessSlug }) => {
  console.log('currentItemState', currentItemState)
  console.log('businessSlug', businessSlug)

  const [title, setTitle] = useState(currentItemState.props?.title || 'Ative as notificações!')
  const [description, setDescription] = useState(currentItemState.props?.description || 'Cadastre-se e não perca nenhuma novidade importante.')
  const [updatingComponent, setUpdatingComponent] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)

  const action = async () => {
    setUpdatingComponent(true)
    const payload = {
      componentId: currentItemState.componentId,
      businessSlug,
      sectionId: currentItemState.sectionId,
      type: currentItemState.type,
      props: {
        title,
        description
      }
    }
    
    try {
      const { data } = await api.put(`v1/component/${currentItemState.componentId}`, payload)
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    setUpdatingComponent(false)
    isOpen(false)
  }

  const handleDelete = async () => {
    setDeletingComponent(true)
    
    try {
      const { data } = await api.put(`v1/component/delete/${currentItemState.componentId}`, { businessSlug, sectionId: currentItemState.sectionId })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingComponent(false)
  }

  return (
    <>
    {
      !showDeleteComponent && <Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        label="Chamada"
        />

      </Box>
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        label="Descrição"
        />

      </Box>
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingComponent} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>
    </Box>
    
    
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar este componente. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingComponent}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}

const EditParagraph = ({ currentItemState, saveItemEdition, isOpen, businessSlug }) => {
  console.log('currentItemState', currentItemState)
  console.log('businessSlug', businessSlug)
  const [link, setLink] = useState(currentItemState.props?.link)
  const [label, setLabel] = useState(currentItemState.props?.text)
  const [icon, setIcon] = useState(currentItemState.props?.icon?.id || null)
  const [color, setColor] = useState(currentItemState.props?.color)
  const [updatingComponent, setUpdatingComponent] = useState(false)
  const [deletingComponent, setDeletingComponent] = useState()
  const [showDeleteComponent, setShowDeleteComponent] = useState(false)

  function formatLink(rawLink) {
    if(rawLink.startsWith('https://') || rawLink.startsWith('http://')) return rawLink
    
    return `http://${rawLink}`
  }
  const action = async () => {
    setUpdatingComponent(true)
    const payload = {
      componentId: currentItemState.componentId,
      businessSlug,
      sectionId: currentItemState.sectionId,
      type: currentItemState.type,
      props: {
        text: label
      }
    }
    console.log('payload', payload)
    
    try {
      const { data } = await api.put(`v1/component/${currentItemState.componentId}`, payload)
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    setUpdatingComponent(false)
    isOpen(false)
  }

  const handleDelete = async () => {
    setDeletingComponent(true)
    
    try {
      const { data } = await api.put(`v1/component/delete/${currentItemState.componentId}`, { businessSlug, sectionId: currentItemState.sectionId })
      saveItemEdition(data.workspaceSession)
    } catch(error) {
      console.log('error', error)
    }
    // saveItemEdition({ type: 'sectionTitle', title })
    isOpen(false)
    setDeletingComponent(false)
  }

  return (
    <>
    {
      !showDeleteComponent && <Box>
      {/* <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        value={link}
        onChange={(e) => setLink(e.target.value)}
        label="Exemplo: www.instagram.com/linkhaus.app"
        />

      </Box> */}
      <Box sx={{ paddingTop: 1, paddingBottom: 1 }}>
        <TextField
        fullWidth
        multiline
        rows={3}
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        label='Texto / parágrafo'
        placeholder="Exemplo: Nos siga nas redes sociais, ative as notificações e não perca nenhuma novidade."
        />

      </Box>
      <Stack
      spacing={2}
      direction="row"
      alignItems="flex-end"
    >
      <LoadingButton fullWidth variant='outlined' color="error" onClick={() => setShowDeleteComponent(true)}>Deletar</LoadingButton>

      <LoadingButton fullWidth variant='contained' color="success" loading={updatingComponent} onClick={() => action()}>Salvar</LoadingButton>

    </Stack>
    </Box>
    
    
    }
    {
      showDeleteComponent && <Box>
        <Box mb={2}>
          <Typography variant='h3'>Atenção! </Typography>
          <Typography variant='subtitle1'>Você irá deletar este componente. Essa ação não poderá ser revertida!</Typography>

        </Box>
        <Stack
        spacing={2}
        direction="row"
        alignItems="flex-end"
      >
        <Button
          fullWidth
          color="success"
          variant="contained"
          startIcon={<Iconify icon="eva:checkmark-circle-2-fill" />}
          onClick={() => setShowDeleteComponent(false)}
        >
          Voltar
        </Button>

        <LoadingButton
          fullWidth
          color="error"
          variant="contained"
          startIcon={<Iconify icon="eva:close-circle-fill" />}
          loading={deletingComponent}
          onClick={() => handleDelete()}
        >
          Confirmar
        </LoadingButton>
      </Stack>
      </Box>
    }
    </>
  )
}

const EditSlug = ({ currentWorkspace, updateWorkspaces, isOpen }) => {
  const [slug, setSlug] = useState(currentWorkspace.businessId.slug);
  const [slugError, setSlugError] = useState(null);
  const [submittingSlug, setSubmittingSlug] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
 
  const alphanumeric = /^[-0-9a-zA-Z]+$/;

  const HandleSlugField = (e) => {
    if (e.length > 70) return;
    const newSlug = slugify(e);

    if(newSlug.match(alphanumeric)) {
      setSlug(newSlug.toLowerCase())
      setSlugError(null)
    } else {
      setSlug(newSlug)
      setSlugError('Caractere não permitido. Utilize apenas letras e números!')

    }    
  };

  const onSubmitBusinessSlug = async () => {
    setSubmittingSlug(true)
    const payload ={
      slug,
    }

    try {
      const response = await api.put('v1/business/slug', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
      isOpen(false)
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmittingSlug(false)
  }

  const action = async () => {
    
    isOpen(false)
  }



  return (
    <Box >
          
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
                    <p style={{ fontSize: '12px'}}>https://<strong><span style={{ fontSize: '16px'}}>{slug || 'seu-nome-aqui'}</span></strong>.linkhaus.app</p>
                    </Box>
                      <TextField
                      fullWidth
                        label="Link de compartilhamento"
                        value={slug}
                        color="primary"
                        placeholder="Ex.: linkhaus"
                        error={slugError !== null}
                        helperText={slugError && slugError}
                        onChange={(e) => HandleSlugField(e.target.value)}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        // }}
                      />
                    {/* </FormGroup> */}
                  </Box>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessSlug()} variant="contained" loading={submittingSlug}>
                Atualizar
              </LoadingButton>
            </Stack>
          
          </Box>
  )
}
const EditBusinessName = ({ currentWorkspace, updateWorkspaces, isOpen }) => {
  const [businessName, setBusinessName] = useState(currentWorkspace.businessId.name);
  const [businessNameError, setBusinessNameError] = useState(null);
  const [submittingBusinessName, setSubmittingBusinessName] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const handleBusinessDisplayName = (name) => {
    if (name.length > 60) return;
    // setDisplayName(name);
    setBusinessName(name)
    // HandleSlugField(name.trim());
  };

  const onSubmitBusinessName = async () => {
    setSubmittingBusinessName(true)
    const payload ={
      businessName: businessName.trim(),
    }

    try {
      const response = await api.put('v1/business/name', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
      isOpen(false)
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmittingBusinessName(false)
  };

  const action = async () => {
    
    isOpen(false)
  }



  return (
    <Box m={2}>
          
          
            
              
                  <Box >
                      <TextField
                      fullWidth
                        label="Nome"
                        value={businessName}
                        color="primary"
                        placeholder="Ex.: Linkhaus"
                        // error={newBusinessNameError !== null}
                        onChange={(e) => handleBusinessDisplayName(e.target.value)}
                      />
                  </Box>

                  
           

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessName()} variant="contained" loading={submittingBusinessName}>
                Atualizar
              </LoadingButton>
            </Stack>

          </Box>
          

  )
}
const EditBusinessDescription = ({ currentWorkspace, updateWorkspaces, isOpen }) => {
  const [businessDescription, setBusinessDescription] = useState(currentWorkspace.businessId.description);
  const [businessDescriptionError, setBusinessDescriptionError] = useState(null);
  const [submittingBusinessDescription, setSubmittingBusinessDescription] = useState(false);

  const { enqueueSnackbar } = useSnackbar();


  const handleBusinessDescrilption = (description) => {
    if (description.length > 360) return;
    // setDisplayName(name);
    setBusinessDescription(description)
    // HandleSlugField(name.trim());
  };

  const onSubmitBusinessDescription = async () => {
    setSubmittingBusinessDescription(true)

    const payload ={
      businessDescription,
    }

    try {
      const response = await api.put('v1/business/description', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
      isOpen(false)
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmittingBusinessDescription(false)
  };

  const action = async () => {
    
    isOpen(false)
  }



  return (
    <Box m={2}>
          
                  <Box>
                    {/* <FormGroup> */}
                   
                      <TextField
                      fullWidth
                      multiline
                      rows={6}
                        label="Descrição / bio"
                        value={businessDescription}
                        color="primary"
                        placeholder="Ex.: Sobre a sua empresa ou sobre o seu perfil"
                        error={businessDescriptionError !== null}
                        helperText={businessDescriptionError && businessDescriptionError}
                        onChange={(e) => handleBusinessDescrilption(e.target.value)}
                        // InputProps={{
                        //   startAdornment: <InputAdornment position="start">@</InputAdornment>,
                        // }}
                      />
                    {/* </FormGroup> */}
                  </Box>


            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={() => onSubmitBusinessDescription()} variant="contained" loading={submittingBusinessDescription}>
                Atualizar
              </LoadingButton>
            </Stack>

          </Box>
          

  )
}
const EditColorTheme = ({ currentWorkspace, updateWorkspaces, isOpen }) => {
  const [businessDescription, setBusinessDescription] = useState(currentWorkspace.businessId.description);
  const [businessDescriptionError, setBusinessDescriptionError] = useState(null);
  const [submittingBusinessDescription, setSubmittingBusinessDescription] = useState(false);

  const { enqueueSnackbar } = useSnackbar();


  const handleBusinessDescrilption = (description) => {
    if (description.length > 360) return;
    // setDisplayName(name);
    setBusinessDescription(description)
    // HandleSlugField(name.trim());
  };

  const onSubmitBusinessDescription = async () => {
    setSubmittingBusinessDescription(true)

    const payload ={
      businessDescription,
    }

    try {
      const response = await api.put('v1/business/description', payload)
      const { workspaceSession } = response.data

      // updateWorkspaces(workspaceSession)
      updateWorkspaces(workspaceSession)
      enqueueSnackbar('Mudança concluída');
      isOpen(false)
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }
    setSubmittingBusinessDescription(false)
  };

  const action = async () => {
    
    isOpen(false)
  }



  return <ColorPresetsOptions isOpen={isOpen}/>
}

// const mock = [
//   {
//     id: '123',
//     type: 'linkButton',
//     icon: {
//       id: 'instagram',
//       // props: { fontSize: 'small'},
//     },
//     text: 'Instagram',
//     color: '#E4405F',
//     link: 'https://www.instagram.com/cordeirosoficial/'
//     },
//   {
//     id: 'asd',
//     type: 'linkButton',
//     icon: {
//       id: 'facebook',
//       // props: { fontSize: 'small'},
//     },
//     text: 'Facebook',
//     color: '#3b5998',
//     link: 'https://www.facebook.com/cordeirosoficial'
//   }
// ]

const Section = ({ 
  data: myPageData,
  title,
  section,
  SectionIdx,
  businessId,
  businessSlug,
  upwardSection,
  updateSection,
  downwardSection,
  updateWorkspaces,
  settingSectionsVisible,
  setSettingSectionsVisible
}) => {

  
  const [openEditItemBlock, setOpenEditItemBlock] = useState(false);
  const [dialogContent, setDialogContent] = useState(null)
  const [settingVisible, setSettingVisible] = useState(null)
  // const [components, setComponents] = useState(section.components || [])
console.log('======= === == >', businessId)
const theme = useTheme()

  const saveItemEdition = (data) => {
    updateWorkspaces(data)
    // if (data.type === 'sectionTitle') {
    // } else {

      // const editeditemsBlock = section.components?.map(component => {
      //   if (component.componentId === data.componentId) {
      //     return data
      //   }
      //   return component
      // })
  
      // const updatedBlock = {
      //   ...section,
      //   title: data.title,
      //   components: editeditemsBlock
      // }
      // setComponents(editeditemsBlock)
      // updateSection(updatedBlock)

    // }
  }

  // const editItemTitle = () => {
  //   setDialogContent( <EditBlockTitle currentTitle={sectionTitle} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
  //   setOpenEditItemBlock(true)
  // }

  const editItemComponent = ({ type, ...props }) => {
    console.log('type', type)
    console.log('props ==>', props)
    if (type === 'sectionTitle') {
      setDialogContent( <EditBlockTitle title={section.title} sectionId={props.sectionId} businessSlug={businessSlug}  saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }
    if (type === 'linkButton') {
      const currentItemState = section.components?.find(component => component.componentId === props.componentId)
      setDialogContent( <EditBlockLinkButton currentItemState={currentItemState} businessSlug={businessSlug} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }
    if (type === 'paragraph') {
      const currentItemState = section.components?.find(component => component.componentId === props.componentId)
      setDialogContent( <EditParagraph currentItemState={currentItemState} businessSlug={businessSlug} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }
    if (type === 'getContacts') {
      const currentItemState = section.components?.find(component => component.componentId === props.componentId)
      setDialogContent( <EditGetContacts currentItemState={currentItemState} businessSlug={businessSlug} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }
    if (type === 'youtubeCardVideo') {
      const currentItemState = section.components?.find(component => component.componentId === props.componentId)
      setDialogContent( <EditYoutubeCardVideo currentItemState={currentItemState} businessSlug={businessSlug} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }
    if (type === 'googlemaps') {
      const currentItemState = section.components?.find(component => component.componentId === props.componentId)
      setDialogContent( <EditGoogleMaps currentItemState={currentItemState} businessSlug={businessSlug} saveItemEdition={saveItemEdition} isOpen={setOpenEditItemBlock} />)
    }

    setOpenEditItemBlock(true)

  }

  const addComponent = async (componentType) => {
    const allowedComponentType = ['linkButton', 'paragraph', 'getContacts', 'youtubeCardVideo', 'googlemaps']
    if ( allowedComponentType.includes(componentType)) {
      const componentPayload = {
        sectionId: section.sectionId,
        type: componentType,
        businessSlug
     }
     console.log('componentPayload', componentPayload)

     try {
      const { data } = await api.post('v1/component', componentPayload)
      updateWorkspaces(data.workspaceSession)
     } catch(error) {
      console.log('error', error)
     }
    }
  }

  const handleAddComponent = () => {
    setDialogContent(<AddNewItem addComponent={addComponent} isOpen={setOpenEditItemBlock} sectionId='' businessSlug={businessSlug} />)
    setOpenEditItemBlock(true)
  }

  const upwardComponent = async (idx, currentSection) => {

    if (idx === 0) return

    const componentsToEdit = [...currentSection.components]
    const componentToSwitch = componentsToEdit[idx - 1]
    const currentComponent = componentsToEdit[idx]

    componentsToEdit[idx - 1] =  currentComponent
    componentsToEdit[idx] = componentToSwitch
    console.log('componentsToEdit', componentsToEdit)

    const payload = {
      sortedComponents: componentsToEdit,
      businessSlug
    }

    try {
      const { data } = await api.patch(`v1/mypage/componentSorting/${section.sectionId}`, payload)
      updateWorkspaces(data.workspaceSession)
     } catch(error) {
      console.log('error', error)
     }

  }

  const downwardComponent = async (idx, currentSection) => {
    if (idx === currentSection.components.length - 1) return

    const componentsToEdit = [...currentSection.components]
    const componentToSwitch = componentsToEdit[idx + 1]
    const currentComponent = componentsToEdit[idx]

    componentsToEdit[idx + 1] =  currentComponent
    componentsToEdit[idx] = componentToSwitch
    console.log('componentsToEdit', componentsToEdit)

    const payload = {
      sortedComponents: componentsToEdit,
      businessSlug
    }

    try {
      const { data } = await api.patch(`v1/mypage/componentSorting/${section.sectionId}`, payload)
      updateWorkspaces(data.workspaceSession)
     } catch(error) {
      console.log('error', error)
     }
  }

  return (
    <>
    <Box sx={{ mt: 2, mb: 2 }}>
      <Card >

      {/* <Container fullWidth> */}
      <Stack
        // spacing={2}
        direction="column"
      >
      
        <Box sx={{mb:2}}>
        {
          settingSectionsVisible === section.sectionId && <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{
            backgroundColor: '#F6F6F5',
            // border: '#C0C0C0 1px solid',
            marginTop: '22px'
          }}
        >
                <Box>
                  <IconButton sx={{ m: 1 }} size="small" onClick={() => upwardSection(SectionIdx)} >
                    <ArrowUpwardIcon fontSize='small'/>
                  </IconButton>
                  <IconButton sx={{ m: 1 }} size="small" onClick={() => downwardSection(SectionIdx)} >
                    <ArrowDownwardIcon fontSize='small'/>
                  </IconButton>
                </Box>

            
              <Button variant='contained' sx={{ m: 1 }} size="small" onClick={() => editItemComponent({ type: 'sectionTitle', title: section.title, sectionId: section.sectionId })} >
                Editar
              </Button>
        </Box>
        }
        <Box display='flex' alignItems='center' justifyContent='center' sx={{ paddingLeft: '45px'}}>
          {
            !section.title && <Typography variant='body1'>Título da seção (opcional)</Typography>
          }
          {
            section.title && <Typography variant='h5'>{section.title}</Typography>
          }
          <IconButton sx={{ m: 1 }} size="small" onClick={() => setSettingSectionsVisible(settingSectionsVisible === section.sectionId ? null : section.sectionId)}>
            <EditIcon fontSize='small'/>
          </IconButton>
        </Box>
       
                        
        </Box>

            {
              section.components?.length > 0 && section.components.map((component, idx) => (
                <Box key={component.componentId} mb={2} ml={1} mr={1}>
                <Card  >
                <Box mt={1} mb={1} >
                        {buildComponent({ component, theme, businessSlug: 'fake_slug', businessId, setSettingVisible, settingVisible, data: myPageData })}
                        <Box
                                    display='flex'
                                    alignItems='center'
                                    justifyContent='space-between'
                                    sx={{
                                      // backgroundColor: '#F6F6F5',
                                      // border: '#C0C0C0 1px solid',
                                      // marginBottom: '22px'
                                    }}
                                  >
                                          <Box>
                                            <IconButton sx={{ m: 1 }} size="small" onClick={() => upwardComponent(idx, section)} >
                                              <ArrowUpwardIcon fontSize='small'/>
                                            </IconButton>
                                            <IconButton sx={{ m: 1 }} size="small" onClick={() => downwardComponent(idx, section)} >
                                              <ArrowDownwardIcon fontSize='small'/>
                                            </IconButton>
                                          </Box>

                                      
                                        <Button variant='outlined' sx={{ m: 1 }} size="small" onClick={() => editItemComponent(component)} >
                                          <SettingsIcon fontSize='small' /> Editar
                                        </Button>
                                  </Box>

                    
                </Box>
                </Card>
                </Box>
              ))
            }
        
        </Stack>
      {/* </Container> */}
      <Divider />
      <Box m={2} display='flex' justifyContent='center'>
        {/* <Box display='flex' alignItems='center' justifyContent='center' m={2}>
          <Typography variant='subtitle2'>Adicionar novo item nesta seção</Typography>

        </Box>
        <Tabs value={currentTab} onChange={(event, newValue) => setCurrentTab(newValue)}>
            {TABS.map((tab) => (
              <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>

          {TABS.map(
            (tab) =>
              tab.value === currentTab && (
                <Box key={tab.value}>
                <Box sx={{ mt: 2 }}>
                  {tab.component}
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Button variant='contained' onClick={() => addComponent(tab.value)}>Adicionar {tab.label}</Button>
                </Box>
                </Box>
              )
          )} */}
          <Button variant='contained' onClick={() => handleAddComponent()}>Adicionar novo item</Button>
      </Box>
      </Card>
    </Box>
    <EditBlockTitleDialog open={openEditItemBlock} content={dialogContent} onClose={() => setOpenEditItemBlock(false)}/>
    </>
  )
}

export default function MyPage() {
  const { themeStretch } = useSettingsContext();
  const theme = useTheme()
  const [addingSection, setAddingSection] = useState(false)
  const [settingSectionsVisible, setSettingSectionsVisible] = useState(null)
  const [sections, setSections] = useState([])
  // const [blocks, setBlocks] = useState([])
  const { currentWorkspace, updateWorkspaces } = useAuthContext()
  const [openEditItemBlock, setOpenEditItemBlock] = useState(false);
  const [dialogContent, setDialogContent] = useState(null)
  // console.log('refresh currentWorkspace', currentWorkspace.myPage.sections)
  const { onChangeColorPresets } = useSettingsContext();
  const storageAvailable = localStorageAvailable();

  // eslint-disable-next-line no-prototype-builtins
  const colorPreset = currentWorkspace?.myPage?.themeColor && availableThemeColorPresets.hasOwnProperty(currentWorkspace?.myPage?.themeColor) ? currentWorkspace?.myPage?.themeColor : 'default'
  useEffect(() => {
    if (storageAvailable) {
      onChangeColorPresets({ target: { value:  colorPreset }})
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageAvailable, onChangeColorPresets, colorPreset]);

  useEffect(() => {
    const refreshSections = currentWorkspace?.myPage?.sections || []

    setSections(refreshSections)
  }, [currentWorkspace])
  // const updateBlock = (data) => {
  //   // const blocksToKeep = blocks.filter(block => block.id !== data.id)
  //   const updated = blocks.map(block => {
  //     if (block.id === data.id) {
  //       return data
  //     }
  //     return block
  //   })
  //   setBlocks(updated)
  //   // const updated = [...blocksToKeep, data]
  //   // console.log('blocksToKeep', blocksToKeep)
  //   // console.log('update blocks', data)
  // }

  const addSection = async () => {
    setAddingSection(true)
    const businessSlug = currentWorkspace.myPage.pageSlug
    const payload = { businessSlug }
    try {
      const { data } = await api.post('v1/section', payload)
      // setSections([...sections, data.myPage.sections])

      updateWorkspaces(data.workspaceSession)
    } catch (error) {
      console.log(error)
    }

    const newBlock =   {
      id: uuidv4(),
      sectionTitle: {
        text: null
      },
      components: []
    }

    // setBlocks([...blocks, newBlock])
    setAddingSection(false)
  }

  const upwardSection = async (idx) => {

    if (idx === 0) return

    const sectionsToEdit = [...sections]
    const sectionToSwitch = sectionsToEdit[idx - 1]
    const currentSection = sectionsToEdit[idx]

    sectionsToEdit[idx - 1] =  currentSection
    sectionsToEdit[idx] = sectionToSwitch

    const payload = {
      sortedSections: sectionsToEdit,
      businessSlug: currentWorkspace.myPage.pageSlug
    }

    try {
      const { data } = await api.patch('v1/mypage/sectionSorting', payload)
      updateWorkspaces(data.workspaceSession)
     } catch(error) {
      console.log('error', error)
     }

  }

  const downwardSection = async (idx) => {
    if (idx === sections.length - 1) return

    const sectionsToEdit = [...sections]
    const sectionToSwitch = sectionsToEdit[idx + 1]
    const currentSection = sectionsToEdit[idx]

    sectionsToEdit[idx + 1] =  currentSection
    sectionsToEdit[idx] = sectionToSwitch

    const payload = {
      sortedSections: sectionsToEdit,
      businessSlug: currentWorkspace.myPage.pageSlug
    }

    try {
      const { data } = await api.patch('v1/mypage/sectionSorting', payload)
      updateWorkspaces(data.workspaceSession)
     } catch(error) {
      console.log('error', error)
     }
  }

  const updateSection = (data) => {
    console.log('updateSection', data)
    const updated = sections.map(section => {
      if (section.sectionId === data.id) {
        return data
      }
      return section
    })
    setSections(updated)
  }

  const handleDisplayEditLink = () => {
    setDialogContent(<EditSlug isOpen={setOpenEditItemBlock} currentWorkspace={currentWorkspace} updateWorkspaces={updateWorkspaces} />)
    setOpenEditItemBlock(true)
  }
  const handleDisplayEditBusinessName = () => {
    setDialogContent(<EditBusinessName isOpen={setOpenEditItemBlock} currentWorkspace={currentWorkspace} updateWorkspaces={updateWorkspaces} />)
    setOpenEditItemBlock(true)
  }
  const handleDisplayEditBusinessDescription = () => {
    setDialogContent(<EditBusinessDescription isOpen={setOpenEditItemBlock} currentWorkspace={currentWorkspace} updateWorkspaces={updateWorkspaces} />)
    setOpenEditItemBlock(true)
  }
  const handleDisplayEditColorTheme = () => {
    setDialogContent(<EditColorTheme isOpen={setOpenEditItemBlock} currentWorkspace={currentWorkspace} updateWorkspaces={updateWorkspaces} />)
    setOpenEditItemBlock(true)
  }

    return (
    <>
      <Head>
        <title> User: Account Settings | Linkhaus UI</title>
        {/* <Script defer src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`} /> */}
        {/* <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`}
        strategy="lazyOnload"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      /> */}
      </Head>

      <Container disableGutters maxWidth='sm'>
        <Box mb={2}>
          <Card>
              <Box m={2} >
                <Box
                  sx={{ color: theme.palette.primary.contrastText, backgroundColor: theme.palette.primary.main, borderRadius: 1 }}
                  display='flex' alignItems='left' p={1}>

                    <Button
                        fullWidth
                        variant='contained'
                        // sx={{ m: 1 }}
                        target="_blank"
                        rel="noopener"
                        href={`https://${currentWorkspace?.businessId?.slug}.linkhaus.app?ohlhv`}
                        size="small"
                        >
                        <Box display='flex' alignContent='center' alignItems='center'>
                          <Typography sx={{ fontSize: '12px' }}>https://</Typography>
                          <Typography sx={{ fontSize: '16px', fontWeight: '600' }}>{currentWorkspace?.businessId?.slug}</Typography>
                          <Typography sx={{ fontSize: '12px' }}>.linkhaus.app</Typography>
                        </Box>
                    </Button>
                </Box>
                    <Box display='flex' justifyContent='flex-end'>
                      <Button variant='outlined' sx={{ m: 1 }} size="small" onClick={() => handleDisplayEditLink()}> <SettingsIcon fontSize='small' /> Editar link</Button>
                      <Button variant='outlined' sx={{ m: 1 }} size="small" onClick={() => handleDisplayEditColorTheme()}> <ColorLensIcon fontSize='small' /> Editar cor do tema</Button>
                      {/* <Button variant='outlined' sx={{ m: 1 }} size="small">Visualizar </Button>  */}
                      {/* <Button
                        sx={{ m: 1 }}
                        variant='outlined'
                        // endIcon={(<ChangeCircleIcon fontSize="small" />)}
                        // sx={{ mt: 3 }}
                        // variant="contained"
                        // sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
                        target="_blank"
                        rel="noopener"
                        href={`https://${currentWorkspace?.businessId?.slug}.linkhaus.app?ohlhv`}
                        size="small"
                      >
                        Visualizar
                    </Button> */}
                    </Box>
              </Box>
          </Card>
        </Box>

        {
          currentWorkspace?.myPage && <Box>
            <Card sx={{ py: 2, px: 3, textAlign: 'center' }}>
              <MyPageAvatar />
              <Box display='flex' alignItems='center' justifyContent='center' sx={{ paddingLeft: '45px'}}>
              
                <Typography variant='h5'>{currentWorkspace?.businessId.name}</Typography>
                <IconButton sx={{ m: 1 }} size="small" onClick={() => handleDisplayEditBusinessName()}>
                  <EditIcon fontSize='small'/>
                </IconButton>
              </Box>
              
              <Box display='flex' alignItems='center' justifyContent='center' sx={{ paddingLeft: '45px'}}>
              
                {
                  !currentWorkspace?.businessId.description && <Typography variant='body1'>Descrição (opcional)</Typography>
                }
                {
                  currentWorkspace?.businessId.description && <Typography variant='body1'>{currentWorkspace?.businessId.description}</Typography>
                }
                <IconButton sx={{ m: 1 }} size="small" onClick={() => handleDisplayEditBusinessDescription()}>
                  <EditIcon fontSize='small'/>
                </IconButton>
            </Box>

            </Card>
          </Box> 
        }
        

        {
         sections.length > 0 && sections.map((section, SectionIdx) => <Section key={section.sectionId.toString()} setSettingSectionsVisible={setSettingSectionsVisible} settingSectionsVisible={settingSectionsVisible} upwardSection={upwardSection} downwardSection={downwardSection} SectionIdx={SectionIdx} section={section} businessSlug={currentWorkspace?.myPage?.pageSlug} businessId={currentWorkspace?.businessId?._id} data={currentWorkspace?.myPage} updateSection={updateSection} updateWorkspaces={updateWorkspaces}/>)
        }

        <Box m={2}>
          <LoadingButton variant='outlined' fullWidth loading={addingSection} onClick={() => addSection()}>Adicionar Seção</LoadingButton>

        </Box>

      </Container>
      <EditBlockTitleDialog open={openEditItemBlock} content={dialogContent} onClose={() => setOpenEditItemBlock(false)}/>
    </>
  );
}
