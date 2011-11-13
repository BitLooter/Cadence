import os
import sys
from django.core.handlers.wsgi import WSGIHandler

sys.path.append('C:/Develop/html5media')

os.environ['DJANGO_SETTINGS_MODULE'] = 'html5media.settings'

application = WSGIHandler()
