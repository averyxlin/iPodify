# convert django model instances to json (and vice versa)

from rest_framework import serializers
from .models import Song
from .types import Decade, Genre
from .utils import get_message

"""
- in Django REST Freamework (DRF), serializers handles the conversion of complex data types into Python native datatypes (Model -> JSON/XML)
- these can be then rendered into JSON, XML, or other content types
- they can also handle deserialization (JSON/XML -> Model)
- validation: DRF includes built-in validation for common fields (e.g. email, URL, etc.)
"""

# ModelSerializer auto-generates fields based on Song model
class SongSerializer(serializers.ModelSerializer):
    created_at = serializers.DateField(read_only=True)
    updated_at = serializers.DateField(read_only=True)
    decade = serializers.ChoiceField(choices=Decade.choices, read_only=True)
    genre = serializers.ChoiceField(choices=Genre.choices)
    
    def validate_year(self, value):
        """validate that the year is within a reasonable range"""
        if value < 1970 or value > 2029:
            raise serializers.ValidationError(get_message('errors.song.validation.year.invalid'))
        return value

    def validate_spotify_url(self, value):
        """validate that the url is a valid spotify track url"""
        if not value:
            raise serializers.ValidationError(get_message('errors.song.validation.spotify_url.required'))
        if not value.startswith('https://open.spotify.com/track/'):
            raise serializers.ValidationError(get_message('errors.song.validation.spotify_url.invalid'))
        return value

    def validate(self, data):
        """validate the entire data set"""
        # get the title and artist from the data
        title = data.get('title')
        artist = data.get('artist')
        year = data.get('year')
        
        # if we're updating an existing instance, get the current values
        if self.instance:
            title = title or self.instance.title
            artist = artist or self.instance.artist
            year = year or self.instance.year
        
        # check for duplicate title by same artist
        if title and artist:
            existing_song = Song.objects.filter(title=title, artist=artist)
            if self.instance:
                existing_song = existing_song.exclude(pk=self.instance.pk)
            if existing_song.exists():
                raise serializers.ValidationError({
                    'title': get_message('errors.song.validation.unique.artist',
                                       title=title,
                                       artist=artist)
                })
        
        # check for duplicate title in same decade
        if title and year:
            decade = Song.get_decade_from_year(year)
            existing_song = Song.objects.filter(title=title, decade=decade)
            if self.instance:
                existing_song = existing_song.exclude(pk=self.instance.pk)
            if existing_song.exists():
                raise serializers.ValidationError({
                    'title': get_message('errors.song.validation.unique.decade',
                                       title=title,
                                       decade=decade)
                })
        
        return data

    class Meta:
        model = Song
        fields = '__all__' # all model fields in the API