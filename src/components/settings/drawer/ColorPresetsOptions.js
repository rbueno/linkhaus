/* eslint-disable react-hooks/exhaustive-deps */
// @mui
import { alpha } from '@mui/material/styles';
import { RadioGroup } from '@mui/material';
import PropTypes from 'prop-types'
import { useSnackbar } from 'notistack';
//
import { useEffect } from 'react';
import { useSettingsContext } from '../SettingsContext';
import { StyledCard, StyledWrap, MaskControl, StyledCircleColor } from '../styles';
import api from '../../../utils/axios'

// ----------------------------------------------------------------------

ColorPresetsOptions.propTypes = {
  isOpen: PropTypes.func
}

export default function ColorPresetsOptions({ isOpen }) {
  const { themeColorPresets, onChangeColorPresets, presetsOption } = useSettingsContext();
  const { enqueueSnackbar } = useSnackbar();
  const handleOnChangeColorPresets = async (e) => {
    const payload ={
      themeColor: e.target.value
    }

    try {
      const response = await api.put('v1/business/themecolor', payload)
      
      // const { workspaceSession } = response.data
      // updateWorkspaces(workspaceSession)
      onChangeColorPresets(e)
      enqueueSnackbar('Mudança concluída');
      isOpen(false)
    } catch (error) {
      enqueueSnackbar(error.message && error.message, { variant: 'error' });
      console.error(error);
    }

  }

  
  // useEffect(() => {
  // },[themeColorPresets])

  return (
    <RadioGroup name="themeColorPresets" value={themeColorPresets} onChange={handleOnChangeColorPresets}>
      <StyledWrap sx={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        {presetsOption.map((color) => {
          const { name, value } = color;

          const selected = themeColorPresets === name;

          return (
            <StyledCard
              key={name}
              selected={selected}
              sx={{
                height: 48,
                ...(selected && {
                  bgcolor: alpha(value, 0.08),
                  borderColor: alpha(value, 0.24),
                }),
              }}
            >
              <StyledCircleColor selected={selected} color={value} />

              <MaskControl value={name} />
            </StyledCard>
          );
        })}
      </StyledWrap>
    </RadioGroup>
  );
}
