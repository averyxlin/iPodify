from django.db import models
from .types import Decade, Genre

class Song(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    artist = models.CharField(max_length=100)
    album = models.CharField(max_length=255)
    year = models.IntegerField()
    duration = models.IntegerField()
    spotify_url = models.CharField(max_length=1000)
    cover_art_url = models.URLField(max_length=1000, null=True, blank=True)
    decade = models.CharField(
        max_length=3,
        choices=Decade.choices,
        default=Decade.TWENTIES_TWO
    )
    genre = models.CharField(
        max_length=20,
        choices=Genre.choices,
        default=Genre.POP
    )
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    @classmethod
    def get_decade_from_year(cls, year):
        """determine the decade based on the year"""
        if 1970 <= year <= 1979:
            return Decade.SEVENTIES
        elif 1980 <= year <= 1989:
            return Decade.EIGHTIES
        elif 1990 <= year <= 1999:
            return Decade.NINETIES
        elif 2000 <= year <= 2009:
            return Decade.TWENTIES
        elif 2010 <= year <= 2019:
            return Decade.TENS
        elif 2020 <= year <= 2029:
            return Decade.TWENTIES_TWO
        else:
            return Decade.TWENTIES_TWO  # default to current decade if year is out of range

    def save(self, *args, **kwargs):
        """override save to automatically set decade based on year"""
        self.decade = Song.get_decade_from_year(self.year)  # call the class method directly
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-created_at']
        unique_together = [
            ('title', 'artist'),  # primary group constraint
            ('title', 'album')    # secondary group constraint
        ]

    def __str__(self):
        return f"{self.title} - {self.artist}"