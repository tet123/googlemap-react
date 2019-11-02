import React, {useEffect, useContext, useState} from 'react'
import uuid from 'uuid/v1'
import {useGoogleListener, useMemoizedOptions} from '../hooks'
import {DEFAULT_MAP_OPTIONS, DEFAULT_MAP_STYLE} from '../common/constants'
import {MapBoxProps} from '../common/types'
import {GoogleMapContext} from '../contexts/GoogleMapContext'

const MapBox = ({
  className,
  style = DEFAULT_MAP_STYLE,
  opts = DEFAULT_MAP_OPTIONS,
  LoadedComponent = null,
  LoadingComponent = <p>Loading...</p>,
  onBoundsChanged,
  onCenterChanged,
  onClick,
  onDoubleClick,
  onDrag,
  onDragEnd,
  onDragStart,
  onHeadingChanged,
  onIdle,
  onMapTypeIdChanged,
  onMouseMove,
  onMouseOut,
  onMouseOver,
  onProjectionChanged,
  onRightClick,
  onTilesLoaded,
  onTiltChanged,
  onZoomChanged,
}: MapBoxProps) => {
  // Get access to the Google Map context
  const {state, dispatch} = useContext(GoogleMapContext)
  const [prevOpts, setPrevOpts] = useState('')
  const [map, setMap] = useState<google.maps.Map | undefined>(undefined)

  // Generate a random id for the DOM node where Google Map will be inserted
  const [mapItemId] = useState(`map-${uuid()}`)

  // Define action dispatchers
  const initMap = (
    map: google.maps.Map,
    places?: google.maps.places.PlacesService,
  ) => dispatch({type: 'init_map', map: map, places: places})
  const reset = () => dispatch({type: 'reset'})

  useEffect(() => {
    dispatch({type: 'load_api'})
  }, [])

  // Load Google Map
  useEffect(() => {
    if (!state.apiLoaded) return
    const stringifiedOpts = JSON.stringify(opts)
    const map = new google.maps.Map(
      document.getElementById(mapItemId),
      JSON.parse(stringifiedOpts),
    )
    setMap(map)
    setPrevOpts(stringifiedOpts)
    if (state.usePlaces) {
      const places = new google.maps.places.PlacesService(map)
      initMap(map, places)
    } else initMap(map)
    return () => reset()
  }, [state.apiLoaded])

  // Register event listeners
  useGoogleListener(map, [
    {name: 'bounds_changed', handler: onBoundsChanged},
    {name: 'center_changed', handler: onCenterChanged},
    {name: 'click', handler: onClick},
    {name: 'dblclick', handler: onDoubleClick},
    {name: 'drag', handler: onDrag},
    {name: 'dragend', handler: onDragEnd},
    {name: 'dragstart', handler: onDragStart},
    {name: 'heading_changed', handler: onHeadingChanged},
    {name: 'idle', handler: onIdle},
    {name: 'maptypeid_changed', handler: onMapTypeIdChanged},
    {name: 'mousemove', handler: onMouseMove},
    {name: 'mouseout', handler: onMouseOut},
    {name: 'mouseover', handler: onMouseOver},
    {name: 'projection_changed', handler: onProjectionChanged},
    {name: 'rightclick', handler: onRightClick},
    {name: 'tilesloaded', handler: onTilesLoaded},
    {name: 'tilt_changed', handler: onTiltChanged},
    {name: 'zoom_changed', handler: onZoomChanged},
  ])

  // Modify the google.maps.Map object when component props change
  useMemoizedOptions(map, opts, prevOpts, setPrevOpts)

  // Render <MapBox>
  return (
    <>
      {state.apiLoaded ? LoadedComponent : LoadingComponent}
      {typeof document !== 'undefined' ? (
        <div id={mapItemId} style={style} className={className} />
      ) : null}
    </>
  )
}

MapBox.displayName = 'MapBox'

export default MapBox
