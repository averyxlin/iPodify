from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SongViewSet

# create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'songs', SongViewSet, basename='song')

# the api urls are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
] 