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
import EditIcon from '@mui/icons-material/Edit';

const availableIcons = [
    {
      id: 'googlePlayStore',
      tags: ['google', 'android', 'galaxy', 'app', 'store'],
      buildComponent: (props) => <ShopIcon {...props} />
    },
    {
      id: 'appleStore',
      tags: ['apple', 'ios', 'iphone', 'ipad', 'app', 'store'],
      buildComponent: (props) => <AppleIcon {...props} />
    },
    {
      id: 'whatsapp',
      buildComponent: (props) => <WhatsAppIcon {...props} />
    },
    {
      id: 'facebook',
      buildComponent: (props) => <FacebookIcon {...props} />
    },
    {
      id: 'instagram',
      buildComponent:(props) =>  <InstagramIcon {...props} />
    },
    {
      id: 'email',
      buildComponent: (props) => <EmailIcon {...props} />
    },
    {
      id: 'school',
      buildComponent: (props) => <SchoolIcon {...props} />
    },
    {
      id: 'youtube',
      buildComponent: (props) => <YouTubeIcon {...props} />
    },
    {
      id: 'telegram',
      buildComponent: (props) => <TelegramIcon {...props} />
    },
    {
      id: 'camera',
      buildComponent: (props) => <PhotoCameraFrontIcon {...props} />
    },
    {
      id: 'edit',
      buildComponent: (props) => <EditIcon {...props} />
    },
  
  ]

  export default function buildIcon(iconAsset){
    const { id, props } = iconAsset
    const icon = availableIcons.find(availableIcon => availableIcon.id === id)
    // eslint-disable-next-line react/jsx-no-useless-fragment
    if (!icon) return <></>
    return icon.buildComponent(props)
  }

  export function findLinkConfigByIconId(test){
    if(!test) return { id: null, color: null }
    if (test.includes('instagram')) return { id: 'instagram', color: '#E4405F' }
    if (test.includes('youtube')) return { id: 'youtube', color: '#FF0000' }
    if (test.includes('facebook')) return { id: 'facebook', color: '#3b5998' }
    if (test.includes('whatsapp') || test.includes('wa.')) return { id: '}whatsapp', color: '#075e54' }
    if (test.includes('tiktok')) return 'camera'
    if (test.includes('telegram') || test.includes('t.me')) return { id: 'telegram', color: '#229ED9'}
    return { id: null, color: null }
  }
