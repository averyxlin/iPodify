from rest_framework import viewsets, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django_filters.rest_framework import DjangoFilterBackend, FilterSet, CharFilter, NumberFilter
from .models import Song
from .serializers import SongSerializer
from django.utils import timezone
from .utils import get_message

class SongFilter(FilterSet):
    """filter songs by various fields"""
    title = CharFilter(lookup_expr='icontains')
    artist = CharFilter(lookup_expr='icontains')
    genre = CharFilter(lookup_expr='exact')
    decade = CharFilter(lookup_expr='exact')
    year = NumberFilter()
    year_min = NumberFilter(field_name='year', lookup_expr='gte')
    year_max = NumberFilter(field_name='year', lookup_expr='lte')

    class Meta:
        model = Song
        fields = ['title', 'artist', 'genre', 'decade', 'year']

class StandardResultsSetPagination(PageNumberPagination):
    """standard pagination for list endpoints"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100

# ViewSets bundle CRUD operations (GET/POST/PUT/DELETE) into a single class
# ModelViewSet provides default implementations for all actions
# the default actions are: list, create, retrieve, update, partial_update, destroy
# these get overriden to customize the respone
class SongViewSet(viewsets.ModelViewSet):
    """
    - CRUD endpoints for song model 
    - inherits from ModelViewSet which provides default CRUD operations

    apis:
    - GET /songs/ - list all songs
    - GET /songs/<id>/ - retrieve a single song
    - POST /songs/ - create a new song
    - PUT /songs/<id>/ - update a song
    - DELETE /songs/<id>/ - delete a song

    filtering:
    - ?title=song_title - search by title (case-insensitive)
    - ?artist=queen - search by artist (case-insensitive)
    - ?genre=Rock - filter by exact genre
    - ?decade=80s - filter by exact decade
    - ?year=1985 - filter by exact year
    - ?year_min=1980&year_max=1989 - filter by year range
    """

    # queryset: defines which data to expose (all songs in this case)
    queryset = Song.objects.all().order_by('-created_at')
    serializer_class = SongSerializer # serializer class to convert model instances to json
    pagination_class = StandardResultsSetPagination # add pagination
    filterset_class = SongFilter # add filtering
    
    def get_permissions(self):
        """
        List and retrieve actions are allowed for any authenticated user.
        Create, update, and delete actions require admin privileges.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        """
        - list endpoint: get /songs/
        """
        try:
            queryset = self.filter_queryset(self.get_queryset())
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
        except Exception as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": get_message('errors.song.list.failed'),
                "error": str(e),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)
            

    def retrieve(self, request, *args, **kwargs):
        """
        - retrieve endpoint: GET /songs/<id>/
        """
        try: 
            instance = self.get_object()
            serializer = self.get_serializer(instance)

            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "data": serializer.data, 
                "links": {
                    "collection": request.build_absolute_uri('/songs/'),
                    "spotify": instance.spotify_url,
                },
                "timestamp": timezone.now().isoformat()
            }

            return Response(response, status=status.HTTP_200_OK)

        except Song.DoesNotExist:
            return Response({
                "status": "error",
                "code": status.HTTP_404_NOT_FOUND,
                "message": get_message('errors.song.retrieve.not_found'),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": get_message('errors.song.retrieve.failed'),
                "error": str(e),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)


    def create(self, request, *args, **kwargs):
        """
        - create endpoint: post /songs/
        """ 
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)

            response = {
                "status": "success",
                "code": status.HTTP_201_CREATED,
                "message": get_message('errors.song.create.success'),
                "data": serializer.data,
                "timestamp": timezone.now().isoformat()
            }

            headers = self.get_success_headers(serializer.data)
            return Response(response, status=status.HTTP_201_CREATED, headers=headers)

        except serializers.ValidationError as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": e.detail,
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": get_message('errors.song.create.failed'),
                "error": str(e),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)
            
    def update(self, request, *args, **kwargs):
        """
        - update endpoint: patch /songs/<id>/
        - allows partial updates of song fields
        """
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            
            response = {
                "status": "success",
                "code": status.HTTP_200_OK,
                "message": get_message('errors.song.update.success'),
                "data": serializer.data,
                "timestamp": timezone.now().isoformat()
            }

            return Response(response, status=status.HTTP_200_OK)

        except serializers.ValidationError as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": e.detail,
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": get_message('errors.song.update.failed'),
                "error": str(e),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, *args, **kwargs):
        """
        - delete endpoint: DELETE /songs/<id>/
        """
        try:
            instance = self.get_object()
            self.perform_destroy(instance)

            return Response({
                "status": "success",
                "code": status.HTTP_204_NO_CONTENT,
                "message": get_message('errors.song.delete.success'),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_204_NO_CONTENT)
        
        except Song.DoesNotExist:
            return Response({
                "status": "error",
                "code": status.HTTP_404_NOT_FOUND,
                "message": get_message('errors.song.delete.not_found'),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({
                "status": "error",
                "code": status.HTTP_400_BAD_REQUEST,
                "message": get_message('errors.song.delete.failed'),
                "error": str(e),
                "timestamp": timezone.now().isoformat()
            }, status=status.HTTP_400_BAD_REQUEST)