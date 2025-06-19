import os
import base64
import requests
from django.conf import settings
from typing import Dict, Optional

class SpotifyService:
    def __init__(self):
        self.client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        self.token_url = 'https://accounts.spotify.com/api/token'
        self.api_base_url = 'https://api.spotify.com/v1'
        self._access_token = None

    def _get_access_token(self) -> str:
        """Get Spotify access token using client credentials flow."""
        if self._access_token:
            return self._access_token

        # Encode client ID and secret
        auth_string = f"{self.client_id}:{self.client_secret}"
        auth_bytes = auth_string.encode('utf-8')
        auth_base64 = str(base64.b64encode(auth_bytes), 'utf-8')

        headers = {
            'Authorization': f'Basic {auth_base64}',
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        data = {'grant_type': 'client_credentials'}

        try:
            response = requests.post(self.token_url, headers=headers, data=data)
            response.raise_for_status()
            json_result = response.json()
            self._access_token = json_result['access_token']
            return self._access_token
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get Spotify access token: {str(e)}")

    def search(self, query: str, search_type: str = 'track,artist,album', limit: int = 10, offset: int = 0) -> Dict:
        """
        Search Spotify catalog for tracks, artists, or albums.
        
        Args:
            query (str): Search query string
            search_type (str): Comma-separated list of item types to search across.
                             Valid types are: album, artist, playlist, track
            limit (int): Maximum number of results to return. Default: 10
            offset (int): The index of the first result to return. Default: 0
            
        Returns:
            Dict: Spotify search results
        """
        token = self._get_access_token()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        params = {
            'q': query,
            'type': search_type,
            'limit': limit,
            'offset': offset
        }
        
        try:
            response = requests.get(
                f'{self.api_base_url}/search',
                headers=headers,
                params=params
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to search Spotify: {str(e)}")

    def get_track_details(self, track_id: str) -> Dict:
        """
        Get detailed information for a specific track.
        
        Args:
            track_id (str): The Spotify ID for the track
            
        Returns:
            Dict: Track details
        """
        token = self._get_access_token()
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(
                f'{self.api_base_url}/tracks/{track_id}',
                headers=headers
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to get track details: {str(e)}") 