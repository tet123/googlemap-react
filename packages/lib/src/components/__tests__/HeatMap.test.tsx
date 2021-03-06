import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import {render, cleanup, waitFor, act} from '@testing-library/react'
import {GoogleMapProvider, HeatMap, MapBox} from '../../..'
import {defineGlobalVariable} from '../../__test__helpers__'

defineGlobalVariable()

describe('HeatMap', () => {
  it('can be rendered', async () => {
    const {container, rerender} = render(
      <GoogleMapProvider>
        <MapBox apiKey="FAKE_KEY" useVisualization />
        <HeatMap />
      </GoogleMapProvider>,
    )
    await waitFor(() => {
      expect(container.innerHTML).not.toMatch('Loading...')
    })
    act(() => {
      rerender(
        <GoogleMapProvider>
          <MapBox apiKey="FAKE_KEY" useVisualization />
          <HeatMap
            id="heat-map"
            opts={{
              data: [
                {lat: 39, lng: 116},
                {lat: 39.001, lng: 116},
                {lat: 39.002, lng: 116.001, weight: 1.5},
                {lat: 39.002, lng: 116.002, weight: 3.5},
              ],
            }}
          />
        </GoogleMapProvider>,
      )
    })
  })
})
