"""Default settings for the debug configuration

Intended for use with the runserver command."""

from settings_default import *


DEBUG = True
TEMPLATE_DEBUG = DEBUG

INTERNAL_IPS = ('10.0.2.15',)

# Warning: Never ever ever use this in production
SECRET_KEY = "IT'S A SECRET TO EVERYBODY"
