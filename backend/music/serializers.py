# convert django model instances to json (and vice versa)

from rest_framework import serializers
from .models import Song
from .types import Decade, Genre
from .utils import get_message
from django.core.exceptions import ValidationError
from django.utils import timezone

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
    year = serializers.IntegerField()
    cover_art_url = serializers.URLField(required=False, allow_null=True, allow_blank=True)
    
    def validate_year(self, value):
        """validate that the year is within a reasonable range"""
        current_year = timezone.now().year
        if value < 1970 or value > current_year:
            raise serializers.ValidationError(get_message('errors.song.validation.year.invalid'))
        return value

    def validate_duration(self, value):
        """validate that the duration is positive and reasonable"""
        if value <= 0:
            raise serializers.ValidationError(get_message('errors.song.validation.duration.zero_or_negative'))
        if value > 3600:  # 1hr in s
            raise serializers.ValidationError(get_message('errors.song.validation.duration.too_long'))
        return value

    def validate_spotify_url(self, value):
        """validate that the url is a valid spotify track url format"""
        if not value:
            raise serializers.ValidationError(get_message('errors.song.validation.spotify_url.required'))
        if not value.startswith('https://open.spotify.com/track/'):
            raise serializers.ValidationError(get_message('errors.song.validation.spotify_url.invalid'))
        return value

    def validate_cover_art_url(self, value):
        """validate that the cover art url is a valid image url"""
        if not value:
            raise serializers.ValidationError(get_message('errors.song.validation.cover_art_url.required'))
        valid_extensions = ('.jpg', '.jpeg', '.png', '.gif')
        if not any(value.lower().endswith(ext) for ext in valid_extensions):
            raise serializers.ValidationError(get_message('errors.song.validation.cover_art_url.invalid'))
        return value

    def validate(self, data):
        """validate the entire data set"""
        # get the title and artist from the data
        title = data.get('title')
        artist = data.get('artist')
        
        # if we're updating an existing instance, get the current values
        if self.instance:
            title = title or self.instance.title
            artist = artist or self.instance.artist
        
        # check for duplicate title by same artist (Primary group constraint)
        if title and artist:
            existing_song = Song.objects.filter(title=title, artist=artist)
            if self.instance:
                existing_song = existing_song.exclude(pk=self.instance.pk)
            if existing_song.exists():
                raise serializers.ValidationError(
                    get_message('errors.song.validation.unique.artist',
                              title=title,
                              artist=artist)
                )
        
        return data

    def to_internal_value(self, data):
        """override to handle model's custom error messages"""
        try:
            return super().to_internal_value(data)
        except ValidationError as e:
            if hasattr(e, 'message_dict'):
                error_msg = str(e)
                if 'unique' in error_msg.lower():
                    if 'title' in data and 'artist' in data:
                        raise serializers.ValidationError({
                            'title': get_message('errors.song.validation.unique.artist',
                                               title=data['title'],
                                               artist=data['artist'])
                        })
            raise serializers.ValidationError(str(e))

    class Meta:
        model = Song
        fields = '__all__' # all model fields in the API