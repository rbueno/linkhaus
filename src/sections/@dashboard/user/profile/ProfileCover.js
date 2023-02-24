import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
// utils
import { bgBlur } from '../../../../utils/cssStyles';
// auth
import { useAuthContext } from '../../../../auth/useAuthContext';
// components
import Image from '../../../../components/image';
import { CustomAvatar } from '../../../../components/custom-avatar';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  '&:before': {
    ...bgBlur({
      color: theme.palette.primary.darker,
    }),
    top: 0,
    zIndex: 9,
    content: "''",
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
}));

const StyledInfo = styled('div')(({ theme }) => ({
  left: 0,
  right: 0,
  zIndex: 99,
  position: 'absolute',
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    // right: 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    // left: theme.spacing(3),
    bottom: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

ProfileCover.propTypes = {
  name: PropTypes.string,
  avatar: PropTypes.string,
  coverImage: PropTypes.string,
  coverColor: PropTypes.string,
};

export default function ProfileCover({ name, avatar, coverImage, coverColor }) {
  return (
    <StyledRoot>
      <StyledInfo>
        <CustomAvatar
          src={avatar}
          alt={name}
          name={name}
          sx={{
            mx: 'auto',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: 'common.white',
            width: { xs: 80, md: 80 },
            height: { xs: 80, md: 80 },
          }}
        />

        <Box
          sx={{
            ml: { xs: 1, md: 1 },
            mt: { xs: 1, md: 1 },
            color: 'common.white',
            textAlign: { xs: 'center', md: 'center' },
          }}
        >
          <Typography variant="h4">{name}</Typography>

          {/* <Typography sx={{ opacity: 0.72 }}>{role}</Typography> */}
        </Box>
      </StyledInfo>

      { coverImage && <Image
              alt="cover"
              src={coverImage}
              sx={{
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                position: 'absolute',
              }}
            />}
      
    </StyledRoot>
  );
}
