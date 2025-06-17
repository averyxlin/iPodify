from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.utils import timezone
from .utils import get_message
from django.db import IntegrityError
from django.core.exceptions import ValidationError
from rest_framework import serializers

def custom_exception_handler(exc, context):
    """custom exception handler for consistent error responses"""
    response = exception_handler(exc, context)
    
    if response is not None:
        # handle validation errors
        if isinstance(exc, (ValidationError, serializers.ValidationError)):
            if isinstance(exc, ValidationError) and hasattr(exc, 'message_dict'):
                message = next(iter(exc.message_dict.values()))[0]
            else:
                message = str(exc)
        elif isinstance(response.data, str):
            message = response.data
        elif isinstance(response.data, dict):
            if 'non_field_errors' in response.data:
                message = response.data['non_field_errors'][0]
                response.data = {
                    'status': 'error',
                    'code': response.status_code,
                    'message': message,
                    'timestamp': timezone.now().isoformat()
                }
                return response
            else:
                message = next(iter(response.data.values()))[0] if response.data else str(exc)
        else:
            message = str(exc)
        
        response.data = {
            'status': 'error',
            'code': response.status_code,
            'message': message,
            'timestamp': timezone.now().isoformat()
        }
    
    return response 