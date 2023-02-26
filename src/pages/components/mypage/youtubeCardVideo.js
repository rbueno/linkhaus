import * as React from 'react';
import PropTypes from 'prop-types'
import { styled, useTheme } from '@mui/material/styles';
import { Card, Button } from '@mui/material';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import YouTube from 'react-youtube';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

YoutubeCardVideo.propTypes = {
    title: PropTypes.string,
    videoId: PropTypes.string,
    subscriptionLink: PropTypes.string,
    subscriptionLinkLabel: PropTypes.string,
    businessSlug: PropTypes.string,
    businessId: PropTypes.string,
    pageId: PropTypes.string,
    component: PropTypes.object,
    eventEntry: PropTypes.func
}

export default function YoutubeCardVideo({ title, videoId, businessSlug, businessId, pageId, component, eventEntry, subscriptionLink, subscriptionLinkLabel}) {
  const theme = useTheme()

  const handleEventEntry = () => {
    if ( !['fake_slug', undefined, null].includes(businessSlug)) {
      eventEntry({ component, eventType: 'youtubePlay', data: { businessId, _id: pageId } })
    }
  }

  return (
    <Card sx={{ backgroundColor: theme.palette.primary.dark }}>
      {
        title && <CardHeader
        // avatar={
        //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
        //     R
        //   </Avatar>
        // }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        sx={{ color: theme.palette.primary.contrastText }}
        title={title}
        // subheader="September 14, 2016"
      />
      }
      
      {/* <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen="false"
            scrolling="no"
            title={title}
            height="280"
            width="100%"
           /> */}

<YouTube
  videoId={videoId}                  // defaults -> ''
  // id={string}                       // defaults -> ''
  // className={string}                // defaults -> ''
  // iframeClassName={string}          // defaults -> ''
  // style={{ width: '30px'}}                    // defaults -> {}
  title={title}                    // defaults -> ''
  // loading={string}                  // defaults -> undefined
  opts={{
    height: '310',
    width: '100%',
  }
}                        // defaults -> {}
  // onReady={() console.log()}                    // defaults -> noop
  onPlay={() => handleEventEntry()}                     // defaults -> noop
  // onPause={func}                    // defaults -> noop
  // onEnd={func}                      // defaults -> noop
  // onError={func}                    // defaults -> noop
  // onStateChange={func}              // defaults -> noop
  // onPlaybackRateChange={func}       // defaults -> noop
  // onPlaybackQualityChange={func}    // defaults -> noop
/>
      {/* <CardContent fullWidth>
        <Typography variant="body2" color={theme.palette.primary.contrastText}>
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the mussels,
          if you like.
        </Typography>
      </CardContent> */}
      {/* <CardActions disableSpacing>
        <Button
            href={subscriptionLink || '#'}
            target='_blank'
            rel='noopener'
            sx={{ color: theme.palette.primary.contrastText }}
        >
            {subscriptionLinkLabel || 'link'}
        </Button>
      </CardActions> */}
    </Card>
  );
}