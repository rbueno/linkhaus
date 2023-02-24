import NextLink from 'next/link'
import { useState } from 'react';
// @mui
import { MenuItem, Stack, Typography, Box, Button, Divider } from '@mui/material';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
// hooks
// import useLocales from '../../../hooks/useLocales';
import { useAuthContext } from '../../../auth/useAuthContext';
// components
// import Image from '../../../components/Image';
// import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import { IconButtonAnimate } from '../../../components/animate';

import { PATH_DASHBOARD } from '../../../routes/paths'

// ----------------------------------------------------------------------

export default function WorkspacePopover() {
  const { workspaces, currentWorkspace, switchWorkspace } = useAuthContext()
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleChangeLang = (newWorkspace) => {
    console.log('newWorkspace', newWorkspace)
    switchWorkspace(newWorkspace)
    handleClose();
  };

  return (
    <>
      {
        currentWorkspace ? (<Box display='flex' flexDirection='row' alignContent='center' alignItems='flex-end'>
        {/* <Typography sx={{ color: 'gray', fontSize: '12px'}} m={0} padding={0}>Área de trabalho: </Typography> */}
        <Button
              variant='contained'
              // endIcon={(<ChangeCircleIcon fontSize="small" />)}
              // sx={{ mt: 3 }}
              // variant="contained"
              // sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
              target="_blank"
              rel="noopener"
              href={`https://${currentWorkspace?.businessId?.slug}.linkhaus.app?ohlhv`}
              sx={{ mr: '15px'}}
            >
              Visualizar
            </Button>
        <Button
              variant='outlined'
              endIcon={(<ChangeCircleIcon fontSize="small" />)}
              // sx={{ mt: 3 }}
              onClick={handleOpen}
              // variant="contained"
              // sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
            >
              {currentWorkspace?.businessId?.slug.slice(0,7)}
            </Button> 
      </Box>) : (<Box display='flex' flexDirection='row' alignContent='center' alignItems='flex-end'>
        {/* <Typography sx={{ color: 'gray', fontSize: '12px'}} m={0} padding={0}>Área de trabalho: </Typography> */}
        <NextLink href={PATH_DASHBOARD.business.new} passHref>
        Criar novo negócio
            </NextLink>
      </Box>)
        
      }
      

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          mt: 1.5,
          ml: 0.75,
          width: 180,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <Stack spacing={0.75}>
          {workspaces.length > 0 && workspaces.map((option) => (
            <MenuItem
              key={option._id}
              selected={option._id === currentWorkspace._id}
              onClick={() => handleChangeLang(option._id)}
            >
              {/* <Image disabledEffect alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} /> */}

              {option.businessId.name}
            </MenuItem>
          ))}
          <Divider />
          

            <NextLink href={PATH_DASHBOARD.business.new} passHref>
            <MenuItem
              key='add_new_workspace'
              selected={false}
              onClick={() => handleClose()}
            >
              {/* <Image disabledEffect alt={option.label} src={option.icon} sx={{ width: 28, mr: 2 }} /> */}

              <AddCircleIcon/>
              Criar novo negócio

            </MenuItem>
            </NextLink>
        </Stack>
      </MenuPopover>
    </>
  );
}
