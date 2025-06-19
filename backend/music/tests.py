from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import Song
from .serializers import SongSerializer
from .types import Genre

class SongTests(TestCase):
    def setUp(self):
        # test users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpass123'
        )
        self.regular_user = User.objects.create_user(
            username='user',
            email='user@example.com',
            password='userpass123'
        )
        
        # test song
        self.song = Song.objects.create(
            title='Test Song',
            artist='Test Artist',
            album='Test Album',
            year=2024,
            duration=180,  # 3 mins in s
            spotify_url='https://open.spotify.com/track/test123',
            genre=Genre.POP
        )
        
        # setup API client
        self.client = APIClient()
        
    def test_song_creation(self):
        """test creating a new song"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        data = {
            'title': 'New Song',
            'artist': 'New Artist',
            'album': 'New Album',
            'year': 2024,
            'duration': 240,  # 4 mins in s
            'spotify_url': 'https://open.spotify.com/track/new123',
            'genre': Genre.POP
        }
        response = self.client.post(url, data, format='json')
        if response.status_code != status.HTTP_201_CREATED:
            print(f"Creation failed with response: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Song.objects.count(), 2)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['data']['title'], 'New Song')
        
    def test_song_validation(self):
        """test song validation rules"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        data = {
            'title': '',  # empty title
            'artist': 'Test Artist',
            'album': 'Test Album',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.POP
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
    def test_song_update(self):
        """test updating a song"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-detail', args=[self.song.id])
        data = {
            'title': 'Updated Song',
            'artist': 'Updated Artist',
            'album': 'Updated Album',
            'year': 2024,
            'duration': 200,
            'spotify_url': 'https://open.spotify.com/track/updated123',
            'genre': Genre.ROCK
        }
        response = self.client.put(url, data, format='json')
        if response.status_code != status.HTTP_200_OK:
            print(f"Update failed with response: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.song.refresh_from_db()
        self.assertEqual(self.song.title, 'Updated Song')
        
    def test_song_delete(self):
        """test deleting a song"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-detail', args=[self.song.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Song.objects.count(), 0)
        
    def test_song_list(self):
        """test listing all songs"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('song-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['data']), 1)
        
    def test_song_detail(self):
        """test retrieving a single song"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('song-detail', args=[self.song.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(response.data['data']['title'], 'Test Song')
        
    def test_regular_user_permissions(self):
        """test regular user permissions"""
        self.client.force_authenticate(user=self.regular_user)
        url = reverse('song-detail', args=[self.song.id])
        data = {
            'title': 'Unauthorized Update',
            'artist': 'Test Artist',
            'album': 'Test Album',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.POP
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
    def test_unauthenticated_access(self):
        """test unauthenticated access"""
        url = reverse('song-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # changed from 401 to 403 since we're using isauthenticated

    def test_invalid_year_validation(self):
        """test validation for invalid year values"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        
        # test year before 1970
        data = {
            'title': 'Old Song',
            'artist': 'Test Artist',
            'album': 'Test Album',
            'year': 1969,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.POP
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['code'], 400)
        self.assertIn('year', response.data['message'])
        
        # test future year
        data['year'] = 3000
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['code'], 400)
        self.assertIn('year', response.data['message'])

    def test_invalid_duration_validation(self):
        """test validation for invalid duration values"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        
        # test negative duration
        data = {
            'title': 'Invalid Duration Song',
            'artist': 'Test Artist',
            'album': 'Test Album',
            'year': 2024,
            'duration': -180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.POP
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['code'], 400)
        self.assertIn('Duration', response.data['message'])
        
        # test zero duration
        data['duration'] = 0
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['code'], 400)
        self.assertIn('Duration', response.data['message'])

    def test_invalid_spotify_url_validation(self):
        """test validation for invalid spotify URLs"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        
        # test invalid URL format
        data = {
            'title': 'Invalid URL Song',
            'artist': 'Test Artist',
            'album': 'Test Album',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'not-a-spotify-url',
            'genre': Genre.POP
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['status'], 'error')
        self.assertEqual(response.data['code'], 400)
        self.assertIn('Spotify', response.data['message'])

    def test_song_filtering(self):
        """test filtering songs by various parameters"""
        # create additional test songs
        Song.objects.create(
            title='Rock Song',
            artist='Rock Artist',
            album='Rock Album',
            year=2023,
            duration=240,
            spotify_url='https://open.spotify.com/track/rock123',
            genre=Genre.ROCK
        )
        Song.objects.create(
            title='Jazz Song',
            artist='Jazz Artist',
            album='Jazz Album',
            year=2022,
            duration=300,
            spotify_url='https://open.spotify.com/track/jazz123',
            genre=Genre.JAZZ
        )

        self.client.force_authenticate(user=self.regular_user)
        base_url = reverse('song-list')

        # test filtering by genre
        response = self.client.get(f"{base_url}?genre=Rock")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['genre'], 'Rock')

        # test filtering by year
        response = self.client.get(f"{base_url}?year=2023")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['year'], 2023)

        # test filtering by artist
        response = self.client.get(f"{base_url}?artist=Test Artist")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['artist'], 'Test Artist')

        # test multiple filters
        response = self.client.get(f"{base_url}?year=2024&genre=Pop")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        self.assertEqual(len(response.data['data']), 1)
        self.assertEqual(response.data['data'][0]['year'], 2024)
        self.assertEqual(response.data['data'][0]['genre'], 'Pop')

    def test_unique_constraint_logic(self):
        """test that unique constraints work correctly according to requirements"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        
        # clear any existing songs to start fresh
        Song.objects.all().delete()
        
        # create first song
        song1_data = {
            'title': 'Unique Test Song',
            'artist': 'Artist A',
            'album': 'Album X',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.ROCK
        }
        response = self.client.post(url, song1_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # create second song with same title but different artist (should work)
        song2_data = {
            'title': 'Unique Test Song',  # Same title
            'artist': 'Artist B',  # Different artist
            'album': 'Album Y',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test456',
            'genre': Genre.ROCK
        }
        response = self.client.post(url, song2_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # create third song with same title and same artist (should fail - artist constraint)
        song3_data = {
            'title': 'Unique Test Song',  # Same title
            'artist': 'Artist A',  # Same artist as first song
            'album': 'Album Z',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test789',
            'genre': Genre.ROCK
        }
        response = self.client.post(url, song3_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data['message'].lower())
        
        # same title, same album, different artist (should fail - album constraint)
        song4_data = {
            'title': 'Unique Test Song',  # Same title
            'artist': 'Artist C',  # Different artist
            'album': 'Album X',  # Same album as first song
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test101',
            'genre': Genre.ROCK
        }
        response = self.client.post(url, song4_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data['message'].lower())
        
        # verify we have exactly 2 songs in the database (both constraints working)
        self.assertEqual(Song.objects.count(), 2)

    def test_album_level_uniqueness_constraint(self):
        """test that no two songs with the same title can exist under the same album"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-list')
        
        # clear any existing songs to start fresh
        Song.objects.all().delete()
        
        # create first song
        song1_data = {
            'title': 'Album Test Song',
            'artist': 'Artist A',
            'album': 'Test Album',
            'year': 2024,
            'duration': 180,
            'spotify_url': 'https://open.spotify.com/track/test123',
            'genre': Genre.POP
        }
        response = self.client.post(url, song1_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # create second song with same title, same album, different artist (should fail)
        song2_data = {
            'title': 'Album Test Song',  # Same title
            'artist': 'Artist B',  # Different artist
            'album': 'Test Album',  # Same album
            'year': 2024,
            'duration': 200,
            'spotify_url': 'https://open.spotify.com/track/test456',
            'genre': Genre.ROCK
        }
        response = self.client.post(url, song2_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('title', response.data['message'].lower())
        
        # create third song with same title, different album, different artist (should work)
        song3_data = {
            'title': 'Album Test Song',  # Same title
            'artist': 'Artist C',  # Different artist
            'album': 'Different Album',  # Different album
            'year': 2024,
            'duration': 220,
            'spotify_url': 'https://open.spotify.com/track/test789',
            'genre': Genre.JAZZ
        }
        response = self.client.post(url, song3_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # create fourth song with different title, same album, different artist (should work)
        song4_data = {
            'title': 'Different Title',  # Different title
            'artist': 'Artist D',  # Different artist
            'album': 'Test Album',  # Same album as first song
            'year': 2024,
            'duration': 240,
            'spotify_url': 'https://open.spotify.com/track/test101',
            'genre': Genre.CLASSICAL
        }
        response = self.client.post(url, song4_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # verify we have exactly 3 songs in the database
        self.assertEqual(Song.objects.count(), 3)

    def test_patch_endpoint(self):
        """test that PATCH endpoint works for partial updates"""
        self.client.force_authenticate(user=self.admin_user)
        url = reverse('song-detail', args=[self.song.id])
        
        # partial update - only change the title
        data = {
            'title': 'Updated Title Only'
        }
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'success')
        
        # verify only the title was updated, other fields remain the same
        self.song.refresh_from_db()
        self.assertEqual(self.song.title, 'Updated Title Only')
        self.assertEqual(self.song.artist, 'Test Artist')  # s hould remain unchanged
        self.assertEqual(self.song.album, 'Test Album')    # should remain unchanged
