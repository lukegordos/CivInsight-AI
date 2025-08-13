'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface GeographicHeatMapProps {
  data: Array<{
    lat: number
    lng: number
    intensity: number
    borough: string
    category: string
  }>
}

export default function GeographicHeatMap({ data }: GeographicHeatMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Initialize map
    mapInstanceRef.current = L.map(mapRef.current).setView([40.7128, -74.0060], 10)

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(mapInstanceRef.current)

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current || !data.length) return

    // Clear existing layers
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.CircleMarker) {
        mapInstanceRef.current?.removeLayer(layer)
      }
    })

    // Add heat map markers
    data.forEach((point) => {
      if (point.lat && point.lng) {
        const intensity = Math.min(point.intensity / 10, 1) // Normalize intensity
        const radius = 5 + (intensity * 15) // Scale radius based on intensity
        
        const color = intensity > 0.7 ? '#dc2626' : // High intensity - red
                     intensity > 0.4 ? '#f59e0b' : // Medium intensity - orange
                     '#10b981' // Low intensity - green

        L.circleMarker([point.lat, point.lng], {
          radius,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.5,
        })
        .bindPopup(`
          <div class="p-2">
            <div class="font-medium">${point.borough}</div>
            <div class="text-sm text-gray-600">${point.category}</div>
            <div class="text-sm">Reports: ${point.intensity}</div>
          </div>
        `)
        .addTo(mapInstanceRef.current!)
      }
    })
  }, [data])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-96 w-full rounded-lg" />
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg">
        <div className="text-sm font-medium mb-2">Report Intensity</div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>
    </div>
  )
}
