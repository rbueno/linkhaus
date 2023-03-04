import PropTypes from 'prop-types';
import { useState } from 'react';
import { format } from 'date-fns'
// @mui
import {
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Label from '../../../../components/label';
import Iconify from '../../../../components/iconify';
import MenuPopover from '../../../../components/menu-popover';
import ConfirmDialog from '../../../../components/confirm-dialog';

// ----------------------------------------------------------------------

UserTableRowSubscribers.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
};

export default function UserTableRowSubscribers({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const { data, createdAt, active } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="subtitle2" noWrap>
            {userId.firstName} {userId.lastName}
            </Typography>
          </Stack>
        </TableCell> */}

        <TableCell align="left">{data || `---`}</TableCell>
        {/* <TableCell align="left">{createdAt || `---`}</TableCell> */}
        <TableCell>{ createdAt ? format(new Date(createdAt), 'dd/MM/yyyy') : '---'}</TableCell>
        <TableCell align="left">{active ? 'ativo' : 'cancelado'}</TableCell>

        {/* <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {roles.join(', ')}
        </TableCell> */}

        

        

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
      </TableRow>

      {/* <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover> */}
    </>
  );
}
