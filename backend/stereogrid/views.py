from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .spotify_service import SpotifyService
import re

@api_view(['GET'])
def spotify_search(request):
    """
    Search Spotify catalog for tracks, artists, or albums.
    """
    try:
        query = request.GET.get('q', '')
        search_type = request.GET.get('type', 'track,artist,album')
        limit = int(request.GET.get('limit', 10))
        offset = int(request.GET.get('offset', 0))
        
        if not query:
            return Response(
                {'error': 'Search query is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        spotify_service = SpotifyService()
        results = spotify_service.search(
            query=query,
            search_type=search_type,
            limit=limit,
            offset=offset
        )
        
        return Response(results)
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
def validate_spotify_url(request):
    """
    Validate a Spotify URL to check if it's accessible and playable.
    """
    try:
        url = request.data.get('url', '')
        
        if not url:
            return Response(
                {'error': 'URL is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Basic format validation
        if not url.startswith('https://open.spotify.com/track/'):
            return Response({
                'valid': False,
                'error': 'Invalid Spotify URL format. Must start with https://open.spotify.com/track/'
            }, status=status.HTTP_200_OK)
        
        # Extract track ID
        track_id_match = re.search(r'/track/([a-zA-Z0-9]+)', url)
        if not track_id_match:
            return Response({
                'valid': False,
                'error': 'Invalid track ID in Spotify URL'
            }, status=status.HTTP_200_OK)
        
        track_id = track_id_match.group(1)
        
        # Try to get track details from Spotify API
        try:
            spotify_service = SpotifyService()
            track_details = spotify_service.get_track_details(track_id)
            
            # Check if track is available
            if track_details.get('is_playable', True) and not track_details.get('is_local', False):
                return Response({
                    'valid': True,
                    'track_details': {
                        'name': track_details.get('name'),
                        'artist': track_details.get('artists', [{}])[0].get('name'),
                        'album': track_details.get('album', {}).get('name'),
                        'duration_ms': track_details.get('duration_ms'),
                        'external_urls': track_details.get('external_urls', {})
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'valid': False,
                    'error': 'Track is not available for playback'
                }, status=status.HTTP_200_OK)
                
        except Exception as e:
            return Response({
                'valid': False,
                'error': f'Track not found or not accessible: {str(e)}'
            }, status=status.HTTP_200_OK)
            
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
def spotify_token(request):
    """
    Get a Spotify access token for the Web Playback SDK.
    This endpoint should use the client credentials flow to get a token.
    """
    try:
        spotify_service = SpotifyService()
        token = spotify_service._get_access_token()
        
        return Response({
            'token': token
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        ) 