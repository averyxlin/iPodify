from django.db import models

class Decade(models.TextChoices):
    SEVENTIES = '70s', '70s'
    EIGHTIES = '80s', '80s'
    NINETIES = '90s', '90s'
    TWENTIES = '00s', '00s'
    TENS = '10s', '10s'
    TWENTIES_TWO = '20s', '20s'

class Genre(models.TextChoices):
    ROCK = 'Rock', 'Rock'
    POP = 'Pop', 'Pop'
    DISCO = 'Disco', 'Disco'
    NEW_WAVE = 'New Wave', 'New Wave'
    HIP_HOP = 'Hip Hop', 'Hip Hop'
    ELECTRONIC = 'Electronic', 'Electronic'
    JAZZ = 'Jazz', 'Jazz'
    CLASSICAL = 'Classical', 'Classical'
    COUNTRY = 'Country', 'Country'
    R_AND_B = 'R&B', 'R&B' 