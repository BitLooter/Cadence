import os
import sys
from django.core.handlers.wsgi import WSGIHandler

sys.path.append('C:/Develop/Cadence')

os.environ['DJANGO_SETTINGS_MODULE'] = 'cadence.settings'

application = WSGIHandler()
