import httpx
import logging
from typing import Optional, Dict, Any
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut

logger = logging.getLogger(__name__)


class GeocodingService:
    """Service for geocoding addresses and reverse geocoding coordinates."""
    
    def __init__(self):
        self.nominatim = Nominatim(user_agent="civinsight-ai")
    
    async def geocode_address(self, address: str) -> Optional[Dict[str, float]]:
        """Convert address to coordinates."""
        try:
            location = self.nominatim.geocode(address, timeout=10)
            if location:
                return {
                    "lat": location.latitude,
                    "lon": location.longitude
                }
            return None
        except GeocoderTimedOut:
            logger.warning(f"Geocoding timeout for address: {address}")
            return None
        except Exception as e:
            logger.error(f"Geocoding error for address '{address}': {e}")
            return None
    
    async def reverse_geocode(self, lat: float, lon: float) -> Optional[str]:
        """Convert coordinates to address."""
        try:
            location = self.nominatim.reverse((lat, lon), timeout=10)
            if location:
                return location.address
            return None
        except GeocoderTimedOut:
            logger.warning(f"Reverse geocoding timeout for coords: {lat}, {lon}")
            return None
        except Exception as e:
            logger.error(f"Reverse geocoding error for coords {lat}, {lon}: {e}")
            return None
