from rest_framework.views import exception_handler
from rest_framework.response import Response
from django.utils import timezone
from .utils import get_message

def custom_exception_handler(exc, context):
    """custom exception handler for consistent error responses"""
    response = exception_handler(exc, context)
    
    if response is not None:
        # if the error is already a localized message, use it directly
        if isinstance(response.data, str):
            message = response.data
        # if it's a dict of field errors, use the first error message
        elif isinstance(response.data, dict):
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