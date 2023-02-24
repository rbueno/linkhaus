/* eslint-disable react/state-in-constructor */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
// import React, { Component } from 'react';
// import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';


// const mapStyles = {
//   width: '550px',
//   height: '400px'
// };

// export class MapContainer extends Component {
//   lat = 0

//   lng = 0

//   markerName = 'Local'

//   constructor(lat, lng, markerName) {
//     super()
//     this.lat = lat
//     this.lng = lng
//     this.markerName = markerName
//   }

//   state = {
//     showingInfoWindow: false,  // Hides or shows the InfoWindow
//     activeMarker: {},          // Shows the active marker upon click
//     selectedPlace: {}          // Shows the InfoWindow to the selected place upon a marker
//   };

//   onMarkerClick = (props, marker, e) => {
//     console.log(' props', props)
//     return  this.setState({
//       selectedPlace: props,
//       activeMarker: marker,
//       showingInfoWindow: true
//     });
//   }
   

//   onClose = props => {
//     if (this.state.showingInfoWindow) {
//       this.setState({
//         showingInfoWindow: false,
//         activeMarker: null
//       });
//     }
//   };

//   render() {
//     return (
//       <Map
//         google={this.props.google}
//         zoom={16}
//         style={mapStyles}
//         initialCenter={
//           {
//             // -23.530057127172604, -46.68640426068501
//             lat: this.lat,
//             lng: this.lng
//           }
//         }
//       >
//           <Marker
//           onClick={this.onMarkerClick}
//           name={this.markerName}
//         />

//         <InfoWindow
//           marker={this.state.activeMarker}
//           visible={this.state.showingInfoWindow}
//           onClose={this.onClose}
//         >
//           <div>
//             {/* {console.log('this state', this.state)} */}
//             <h4>{this.state.selectedPlace.mapCenter?.lat?.markerName}</h4>
//           </div>
//         </InfoWindow>
//       </Map>
//     );
//   }
// }

// export default GoogleApiWrapper({
//   apiKey: process.env.google_maps_api
// })(MapContainer);

import { useState } from 'react'
import NextLink from 'next/link'
import { GoogleMap, Marker, useLoadScript, InfoWindow } from '@react-google-maps/api'
import { Button, Stack, Typography } from '@mui/material'

const containerStyle = {
  width: '100%',
  height: '400px'
};

export function Map(props){
const { lat, lng, placeId, placeTitle, placeAddress } = props
console.log('placeTitle', placeTitle)
console.log('placeAddress', placeAddress)
const [displayInfoWindow, setDisplayInfoWindow] = useState(true)  

const markerOnClick = dataonCloseClick => {
  setDisplayInfoWindow(true)
}

const HandleOnCloseClick = data => {
  setDisplayInfoWindow(false)
}

  return (
    <>
    <GoogleMap
      zoom={16}
      center={{ lat, lng }}
      mapContainerStyle={containerStyle}
    >
      <Marker onClick={markerOnClick} position={{ lat, lng }} />
      {displayInfoWindow && <InfoWindow
        onCloseClick={HandleOnCloseClick}
        position={{ lat, lng }}
      >
        <div style={{
            background: `white`,
            border: `1px solid #ccc`,
            padding: 15
          }}>
            <Typography variant='subtitle1'>{placeTitle}</Typography>
            <Typography variant='caption'>{placeAddress}</Typography>
            <Button
                // component={NextLink}
                size="small"
                href={`https://maps.google.com/maps?ll=${lat},${lng}&z=16&t=m&hl=pt-BR&gl=BR&mapclient=apiv3&cid=${placeId}`}
                // href={PATH_DOCS.root} 
                target="_blank"
                rel="noopener" 
                // disabled={false}
                onClick={() => console.log('send api data')}
                // disabled={props?.data?.Celular ? false : true}
                // onClick={() => handleWhatsAppClick(props.data.Celular)} disableRipple
              >
                Abrir no Google Maps
            </Button>
            {/* <NextLink
              noWrap
              // key={href}
              href={`https://maps.google.com/maps?ll=${lat},${lng}&z=16&t=m&hl=pt-BR&gl=BR&mapclient=apiv3&cid=${placeId}`}
              variant="body2"
              target="_blank"
              rel="noopener"
              sx={{ display: 'table' }}
            >
              Abrir no Google Maps
            </NextLink> */}
        </div>
      </InfoWindow>}
    </GoogleMap>
    <Stack>
    <Typography variant='subtitle1'>{placeTitle}</Typography>
    <Typography variant='caption'>{placeAddress}</Typography>
    </Stack>
    
    </>
  )
}
export default function MapComponent(props) {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY })
  if (!isLoaded) return <>Carregando...</>
  return <Map {...props} />

}