import json
import os

def load_messages():
    """load messages from json files in the locales directory"""
    messages = {}
    locales_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'locales')
    
    # load error messages
    error_file = os.path.join(locales_dir, 'en', 'errors.json')
    with open(error_file, 'r') as f:
        messages['errors'] = json.load(f)
    
    return messages

# load messages once when module is imported
MESSAGES = load_messages()

def get_message(path, **kwargs):
    """
    get a message from the loaded messages
    
    args:
        path: dot-separated path to the message (e.g. 'errors.song.retrieve.not_found')
        **kwargs: format parameters for the message
    
    returns:
        formatted message string
    """
    # split the path into parts
    parts = path.split('.')
    
    # navigate to the message
    message = MESSAGES
    for part in parts:
        message = message[part]
    
    # format the message with any provided parameters
    return message.format(**kwargs) 