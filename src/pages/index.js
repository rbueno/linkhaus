import { useTheme } from '@mui/material/styles';
import React, { useState, useEffect, useRef, Component } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import PropTypes from 'prop-types';

import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import AppleIcon from '@mui/icons-material/Apple';
import ShopIcon from '@mui/icons-material/Shop';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';
import YouTubeIcon from '@mui/icons-material/YouTube';
import TelegramIcon from '@mui/icons-material/Telegram';

import PhotoCameraFrontIcon from '@mui/icons-material/PhotoCameraFront';
import Head from 'next/head';
import { Wrapper } from "@googlemaps/react-wrapper";
import {Loader} from '@googlemaps/js-api-loader';
import { Map, GoogleApiWrapper } from 'google-maps-react';
// @mui
import { Tab, Card, Tabs, Container, Box, Chip, Stack, Avatar, Rating, Button, CardHeader, Typography } from '@mui/material';

import { Data } from '@react-google-maps/api';
import { m, useScroll, useSpring } from 'framer-motion';
// routes
import { PATH_DASHBOARD } from '../routes/paths';
// auth
import { useAuthContext } from '../auth/useAuthContext';
// _mock_
import {
  _userAbout,
  _userFeeds,
  _userFriends,
  _userGallery,
  _userFollowers,
} from '../_mock/arrays';
// layouts
import DashboardLayout from '../layouts/dashboard';
import MainLayout from '../layouts/main';
import Footer from '../layouts/main/Footer';
// components
import Iconify from '../components/iconify';
import CustomBreadcrumbs from '../components/custom-breadcrumbs';
import { useSettingsContext } from '../components/settings';
// sections
import {
  Profile,
  ProfileCover,
  ProfileFriends,
  ProfileGallery,
  ProfileFollowers,
} from '../sections/@dashboard/user/profile';
import localStorageAvailable from '../utils/localStorageAvailable';
// import { Home } from '@mui/icons-material';
import MapComponent from './components/mypage/mapComponent'
import NotFound from './404'
import GetContactComponent from './components/mypage/getContactComponent'
import YoutubeCardVideo from './components/mypage/youtubeCardVideo'
import api from '../utils/axios'


// sections
import {
  HomeHero,
  HomeMinimal,
  HomeDarkMode,
  HomeLookingFor,
  HomeForDesigner,
  HomeColorPresets,
  HomePricingPlans,
  HomeAdvertisement,
  HomeCleanInterfaces,
  HomeHugePackElements,
  HomeService01,
  HomeServiceL02,
  HomeServiceR2
} from '../sections/home';

// ----------------------------------------------------------------------

// UserProfilePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;
UserProfilePage.getLayout = (page) => <> {page} </>;
LandingPage.getLayout = (page) => <MainLayout> {page} </MainLayout>;
// ----------------------------------------------------------------------


const availableIcons = [
  {
    iconId: 'googlePlayStore',
    iconComponent: <ShopIcon />
  },
  {
    iconId: 'appleStore',
    iconComponent: <AppleIcon />
  },
  {
    iconId: 'whatsapp',
    iconComponent: <WhatsAppIcon />
  },
  {
    iconId: 'facebook',
    iconComponent: <FacebookIcon />
  },
  {
    iconId: 'instagram',
    iconComponent: <InstagramIcon />
  },
  {
    iconId: 'email',
    iconComponent: <EmailIcon />
  },
  {
    iconId: 'school',
    iconComponent: <SchoolIcon />
  },
  {
    iconId: 'youtube',
    iconComponent: <YouTubeIcon />
  },
  {
    iconId: 'telegram',
    iconComponent: <TelegramIcon />
  },
  {
    iconId: 'camera',
    iconComponent: <PhotoCameraFrontIcon />
  },

]

const availableThemeColorPresets = {
  default: 'default',
  cyan: 'cyan',
  purple: 'purple',
  blue: 'blue',
  orange: 'orange',
  red: 'red'
}

const appBrandColor = {
  youtube: { main: '#FF0000' },
  telegram: { main: '#229ED9' }
}

const dataMock = [
  {
  businessSlug: 'biosom',
  themeColorPresets: 'default',
  meta: {
    headTag: {
      title: 'Biosom | Teste Auditivo',
      description: 'A nossa audição trabalha como teclas em um teclado de piano. Se houver um problema em qualquer tecla, é necessário que haja um ajuste, portanto o "TSC - Threshold Sound Conditioning" desempenha o papel de afinador de piano',
      websiteURL: 'https://biosom.okahub.com',
      ogTitle: 'Biosom | Teste Auditivo',
      image: 'https://play-lh.googleusercontent.com/IcoJiEWg01j35mDIJTH5WZkLR3xYgKxd8gWHVK3LhLouIRsYfDxEsdZgropjwQqY5g',
    }
  },
  header: {
    avatarURL: 'https://play-lh.googleusercontent.com/IcoJiEWg01j35mDIJTH5WZkLR3xYgKxd8gWHVK3LhLouIRsYfDxEsdZgropjwQqY5g',
    name: 'Biosom',
    backgroundColor: null,
    backgroundImage: null,
  },
  contentBlocks: [
    {
      blockTitle: {
        text: null
      },
      blockItems: [{
        type: 'paragraph',
        iconId: null,
        text: `A nossa audição trabalha como teclas em um teclado de piano. Se houver um problema em qualquer tecla, é necessário que haja um ajuste, portanto o "TSC - Threshold Sound Conditioning" desempenha o papel de afinador de piano`,
        color: null,
        link: null
      }]
    },
    {
      blockTitle: {
        text: 'Baixar Hearing Guardian'
      },
      blockItems: [{
        type: 'linkButton',
        iconId: 'googlePlayStore',
        text: 'iOS / iPhone',
        color: '#50c7c7',
        link: 'https://play.google.com/store/apps/details?id=com.biosom.hearingguardianapp&referrer=utm_source%3DBiosomBioLink%2520WebSite%2520Home'
      }]
    },
    {
      blockTitle: {
        text: 'Siga-nos'
      },
      blockItems: [
        {
        type: 'linkButton',
        iconId: 'instagram',
        text: 'Instagram',
        color: '#E4405F',
        link: 'https://www.instagram.com/biosom.app/'
        },
        {
        type: 'linkButton',
        iconId: 'facebook',
        text: 'Facebook',
        color: '#3b5998',
        link: 'https://www.facebook.com/biosom'
        },
    ]
    },
    {
      blockTitle: {
        text: 'Entre em contato'
      },
      blockItems: [
        {
        type: 'linkButton',
        iconId: 'whatsapp',
        text: 'WhatsApp',
        color: '#075e54',
        link: 'https://api.whatsapp.com/send?phone=5511944545541&text=Ol%C3%A1%20pessoal%20da%20Biosom!'
        },
        {
        type: 'linkButton',
        iconId: 'email',
        text: 'Email',
        color: '#34b7f1',
        link: 'mailto:contato@biosom.com.br'
        },
    ]
    },
    {
      blockTitle: {
        text: null
      },
      blockItems: [
        {
        type: 'linkButton',
        iconId: null,
        text: 'Estudos',
        color: null,
        link: 'https://biosom.com.br/estudo'
        },
        {
        type: 'linkButton',
        iconId: null,
        text: 'Website',
        color: null,
        link: 'https://biosom.com.br'
        },
    ]
    },
  ]},
  {
  businessSlug: 'meetmeat',
  address: 'R. Dr. Miranda de Azevedo, 493 - Vila Anglo Brasileira, São Paulo - SP, 05027-000, Brasil',
  name: 'MeetMeat | Espeto & Bar',
  themeColorPresets: 'cyan',
  meta: {
    headTag: {
      title: 'MeetMeat | Espeto & Bar',
      description: `🍗 | O Espeto bar mais divertido da Pompéia
      🍻 | Cervejas, drinks e rolha livre!
      🛵 | Delivery e Ifood
      👇🏻 | chame no Whatsapp e faça sua reserva!`,
      websiteURL: 'https://meetmeat.okahub.com',
      ogTitle: 'MeetMeat | Espeto & Bar',
      image: `data:image/jpeg;base64,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`,
    }
  },
  header: {
    avatarURL: `data:image/jpeg;base64,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`,
    name: 'MeetMeat',
    backgroundColor: null,
    backgroundImage: null,
  },
  contentBlocks: [
    {
      blockTitle: {
        text: null
      },
      blockItems: [{
        type: 'paragraph',
        iconId: null,
        text: `🍗 | O Espeto bar mais divertido da Pompéia
        🍻 | Cervejas, drinks e rolha livre!
        🛵 | Delivery e Ifood
        👇🏻 | chame no Whatsapp e faça sua reserva!`,
        color: null,
        link: null
      }]
    },
    {
      blockTitle: {
        text: null
      },
      blockItems: [{
        type: 'linkButton',
        iconId: 'whatsapp',
        text: 'Reserva e Entrega',
        color: '#075e54',
        link: 'https://api.whatsapp.com/send?1=pt_BR&phone=5511960809585'
      },
      {
        type: 'linkButton',
        iconId: null,
        text: 'Delivery iFood',
        color: null,
        link: 'https://www.ifood.com.br/delivery/sao-paulo-sp/meet-meat-espeto-e-bar-vila-anglo-brasileira/585e4c74-b08c-49ee-a539-7d90eab0efe7?utm_medium=share'
        },
      ]
    },
    {
      blockTitle: {
        text: null
      },
      blockItems: [
        {
        type: 'getContacts',
        }
    ]
    },
    {
      blockTitle: {
        text: 'Siga-nos'
      },
      blockItems: [
        {
          type: 'linkButton',
          iconId: 'instagram',
          text: 'Instagram',
          color: '#E4405F',
          link: 'https://www.instagram.com/meetmeatespetoebar/'
          },
          {
          type: 'linkButton',
          iconId: 'facebook',
          text: 'Facebook',
          color: '#3b5998',
          link: 'https://www.facebook.com/Meetmeatespetoebar'
          }
    ]
    },
    {
      blockTitle: {
        text: 'Onde estamos'
      },
      blockItems: [
        {
        type: 'googlemaps',
        lat: -23.528901333181416,
        lng: -46.68938311842084,
        placeId: '7995735648336148579',
        address: 'R. Dr. Miranda de Azevedo, 493 - Vila Anglo Brasileira, São Paulo - SP, 05027-000, Brasil',
        name: 'MeetMeat | Espeto & Bar',
        }
    ]
    },
  ]},
  {
    businessSlug: 'cordeiros',
    address: 'R. Min. Ferreira Alves, 730 - Pompeia, São Paulo - SP, 05009-060',
    name: 'Cordeiros | Grill & Beer',
    themeColorPresets: 'default',
    meta: {
      headTag: {
        title: 'Cordeiros | Grill & Beer',
        description: `🥩|Restaurante Cordeiros
        🏠|Amor em forma de comida!
        ⏰|Terça a Domingo
        📍|R. Min. Ferreira Alves,730-Pompéia - Whats⤵`,
        websiteURL: 'https://cordeiros.okahub.com',
        ogTitle: 'Cordeiros | Grill & Beer',
        image: `data:image/png;base64,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`,
      }
    },
    header: {
      avatarURL: `data:image/png;base64,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`,
      name: 'Cordeiros',
      backgroundColor: null,
      backgroundImage: null,
    },
    contentBlocks: [
      {
        blockTitle: {
          text: null
        },
        blockItems: [{
          type: 'paragraph',
          iconId: null,
          text: `🥩|Restaurante Cordeiros
          🏠|Amor em forma de comida!
          ⏰|Terça a Domingo
          📍|R. Min. Ferreira Alves,730-Pompéia - Whats⤵`,
          color: null,
          link: null
        }]
      },
      {
        blockTitle: {
          text: null
        },
        blockItems: [{
          type: 'linkButton',
          iconId: 'whatsapp',
          text: 'Chama no Whatsapp',
          color: '#075e54',
          link: 'https://api.whatsapp.com/send?phone=5511995237223'
        },
        {
          type: 'linkButton',
          iconId: null,
          text: 'Delivery iFood',
          color: null,
          link: 'https://www.ifood.com.br/delivery/sao-paulo-sp/cordeiros-grill--beer-pompeia/dd627e9c-e740-443b-a4df-f7869719a0a3?utm_medium=ReserveGoogle'
          },
        ]
      },
      {
        blockTitle: {
          text: null
        },
        blockItems: [
          {
          type: 'getContacts',
          }
      ]
      },
      {
        blockTitle: {
          text: 'Siga-nos'
        },
        blockItems: [
          {
            type: 'linkButton',
            iconId: 'instagram',
            text: 'Instagram',
            color: '#E4405F',
            link: 'https://www.instagram.com/cordeirosoficial/'
            },
            {
            type: 'linkButton',
            iconId: 'facebook',
            text: 'Facebook',
            color: '#3b5998',
            link: 'https://www.facebook.com/cordeirosoficial'
            }
      ]
      },
      {
        blockTitle: {
          text: 'Onde estamos'
        },
        blockItems: [
          {
          type: 'googlemaps',
          lat: -23.528794900011558,
          lng: -46.68654118157122,
          placeId: '13785943608622558848',
          address: 'R. Min. Ferreira Alves, 730 - Pompeia, São Paulo - SP, 05009-060',
          name: 'Cordeiros | Grill & Beer',
          }
      ]
      },
    ]},
    {
      businessSlug: 'profgabs',
      address: null,
      name: 'Prof Gabs | Matemática & Física',
      themeColorPresets: availableThemeColorPresets.purple,
      meta: {
        headTag: {
          title: 'Prof Gabs | Matemática & Física',
          description: `Matemática & Física \n 📚 Matemática - USP
          📝 + 10k alunos em 15 anos
          ⬇️ Estude comigo`,
          websiteURL: 'https://profgabs.okahub.com',
          ogTitle: 'Prof Gabs | Matemática & Física',
          image: `data:image/png;base64,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`,
        }
      },
      header: {
        avatarURL: `data:image/png;base64,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`,
        name: 'Prof Gabs',
        backgroundColor: null,
        backgroundImage: null,
      },
      contentBlocks: [
        {
          blockTitle: {
            text: 'Matemática & Física'
          },
          blockItems: [{
            type: 'paragraph',
            iconId: null,
            text: `📚 Matemática - USP
            📝 + 10k alunos em 15 anos
            ⬇️ Estude comigo`,
            color: null,
            link: null
          }]
        },
        {
          blockTitle: {
            text: null
          },
          blockItems: [
            {
            type: 'youtubeCardVideo',
            title: 'ENEM 2022 | Correção',
            videoId: 'EB1IWcguNqM',
            subscriptionLink: 'https://www.youtube.com/@ProfGabs?sub_confirmation=1',
            subscriptionLinkLabel: 'Inscreva-se no canal'
          },
          ]
        },
        {
          blockTitle: {
            text: 'Estude comigo 📚'
          },
          blockItems: [
            {
            type: 'linkButton',
            iconId: 'school',
            text: 'Curso extensivo 2023',
            color: null,
            link: 'https://hotmart.com/pt-br/marketplace/produtos/matematica-e-fisica-extensivo-2023/C77687862V'
          },
            {
            type: 'linkButton',
            iconId: 'school',
            text: 'Vestibulares 2a Fase 2022',
            color: null,
            link: 'https://hotmart.com/pt-br/marketplace/produtos/vestibulares-2a-fase/I77073619D'
          },
          ]
        },
        {
          blockTitle: {
            text: null
          },
          blockItems: [
            {
            type: 'getContacts',
            }
        ]
        },
        {
          blockTitle: {
            text: 'Siga nas redes'
          },
          blockItems: [
            {
              type: 'linkButton',
              iconId: 'youtube',
              text: 'Youtube',
              color: appBrandColor.youtube.main,
              link: 'https://www.youtube.com/profgabs'
              },
            {
              type: 'linkButton',
              iconId: 'instagram',
              text: 'Instagram',
              color: '#E4405F',
              link: 'https://www.instagram.com/profgabs/'
              },
              {
              type: 'linkButton',
              iconId: 'camera',
              text: 'TikTok',
              color: '#000000',
              link: 'https://www.tiktok.com/@profgabs'
              },
              {
              type: 'linkButton',
              iconId: 'telegram',
              text: 'Grupo do Telegram',
              color: appBrandColor.telegram.main,
              link: 'https://t.me/profgabs'
              }
        ]
        }
      ]}
]

const eventEntry = ({ component, eventType, data }) => {


  const payload = {
    createdAt: new Date,
    context: { userAgent: '' },
    data: component,
    eventType,
    bid: data.businessId,
    pid: data._id,
    componentId: component?.componentId
  }
  console.log('eventEntry', payload)
  // api.post(`v1/evententry`, payload)
  fetch('/api/evententry', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
}

const buildComponent = ({ component, theme, businessSlug, businessId, data }) => {
  const iconComponent = component.props?.icon?.id && availableIcons.find(item => item.iconId === component.props.icon.id)

  // <Button component={NextLink} href="/" size="large" variant="contained">
  //         Go to Home
  //       </Button>
console.log('component ===========+>', component)
if (!component?.props) return <></>
  if (component.type === 'linkButton') {
    return (
      <Button
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
                onClick={() => eventEntry({ component, eventType: 'click', data })}
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
      <Typography textAlign="center" variant="body2">{component.props.text}</Typography>
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
        eventEntry={eventEntry}
      />
    )
  }

  if (component.type === 'getContacts') {
    return (
      <GetContactComponent
      price="$50"
      title={component.props.title}
      description={component.props.description}
      businessSlug={businessSlug}
      businessId={data.businessId}
      pageId={data._id}
      component={component}
      eventEntry={eventEntry}
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
        eventEntry={eventEntry}
      />
    )
  }

  return <></>
}

UserProfilePage.propTypes = {
  business: PropTypes.object,
};
export function UserProfilePage({ business }) {
  const { onChangeColorPresets } = useSettingsContext();
  const storageAvailable = localStorageAvailable();
  const data = business
  console.log('UserProfilePage data', data)
  // eslint-disable-next-line no-prototype-builtins
  const colorPreset = data?.themeColorPresets && availableThemeColorPresets.hasOwnProperty(data?.themeColorPresets) ? data?.themeColorPresets : 'default'
  useEffect(() => {
    if (storageAvailable) {
      onChangeColorPresets({ target: { value:  colorPreset }})
      localStorage.setItem('businessSlug', data.businessSlug)
    }
    eventEntry({ component: {}, eventType: 'view', data })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageAvailable, onChangeColorPresets, colorPreset, data.businessSlug]);

  
  const { user } = useAuthContext();
  const theme = useTheme();

  const components = data.sections.map((section) => (
    <Stack
        spacing={2}
        direction="column"
        sx={{
          p: theme.spacing(3, 0, 3, 0),
        }}
      >
          {section.title && <Typography textAlign="center" variant="h6">{section.title}</Typography>  }
            
          {
            section.components.map(comp => buildComponent({ component: comp, theme, businessSlug: data.pageSlug, businessId: data.businessId, data }))
          }

      </Stack>
   ))

  return (
    <>
      <Head>
        <title>{data.meta?.headTag?.title}</title>
    <meta name="description" content={data.meta?.headTag?.description} />
    <link href={data.meta?.headTag?.websiteURL} rel="canonical" />

    <meta property="og:title" content={data.meta?.headTag?.ogTitle} />
    <meta property="og:url" content={data.meta?.headTag?.websiteURL} />
    <meta property="og:description" content={data.meta?.headTag?.description} />
    <meta property="og:image" content={data.meta?.headTag?.image} />

    {/* {
      microdata && microdata.product && (
        <>
          <meta property="og:price:amount" content={microdata.product.price.original} />
          <meta property="og:price:currency" content="BRL" />

          <meta property="product:brand" content={microdata.business.businessName} />
          <meta property="product:availability" content="in stock" />
          <meta property="product:condition" content="new" />
          <meta property="product:price:amount" content={microdata.product.price.original} />
          <meta property="product:price:currency" content="BRL" />
          <meta property="product:retailer_item_id" content={microdata.product._id} />

          {
      microdata.product.price.sale && (
        <>
          <meta property="product:sale_price:amount" content={microdata.product.price.sale} />
          <meta property="product:sale_price:currency" content="BRL" />
        </>
      )
    }
        </>
      )
    } */}
      </Head>
       <Stack
          spacing={2}
          sx={{
            //  mb: 3,
            // p: theme.spacing(0, 0, 3, 0),
            height: 150,
            position: 'relative',
            width: '100%'
          }}
        >
          <ProfileCover name={data.name} avatar={data.avatarURL} coverImage={data.backgroundImage} coverColor={data.backgroundImage} />
        </Stack>

      <Container maxWidth='sm'>
        
        {
          components.map(item => item)
        }

        
      
      </Container>
      <Footer />
    </>
  );
}




export function LandingPage() {
  const theme = useTheme();

  const { scrollYProgress } = useScroll();

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });



  return (
    <>
      <Head>
        <title> Converta seguidores em leads | Linkhaus</title>
      </Head>

      

      <HomeHero />

      <Box
        sx={{
          overflow: 'hidden',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        {/* <HomeMinimal /> */}

        <HomeLookingFor />
        <HomeService01 />

        <HomeServiceL02 />
        <HomeServiceR2 />
        {/* <HomeHugePackElements /> */}

        {/* <HomeForDesigner /> */}

        {/* <HomeDarkMode /> */}

        {/* <HomeColorPresets /> */}

        {/* <HomeCleanInterfaces /> */}

        {/* <HomePricingPlans /> */}

        

        <HomeAdvertisement />
      </Box>
    </>
  );
}

Home.propTypes = {
  business: PropTypes.object
}

export default function Home({ business }) {
  if (business.pageSlug) return <UserProfilePage business={business} />
  if (business.iswww) return <LandingPage />
  return <LandingPage />
}

export const getServerSideProps = async (prop) => {
  const client = prop.req.headers.host ? prop.req.headers.host.split('.')[0] : null

  if (client === 'www') {
    return {
      props: {
        business:{ iswww: true },
      },
    }
  }
  
  try {
    const { data } = await api.get(`v1/mypage/${client}`)
  console.log('mypage response', data.myPage)
  // const business = dataMock.find(item => item.businessSlug === 'meetmeat')
  // console.log('business', business)
  return {
    props: {
      business: data.myPage
    },
  }
  } catch (error) {
    console.log('caiu no erro', error)
    return {
      props: {
        business:{ iswww: false },
      },
    }
  }
}
