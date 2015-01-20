"""Default settings for the debug configuration

Intended for use with the runserver command."""

from settings_default import *


DEBUG = True
TEMPLATE_DEBUG = DEBUG

INTERNAL_IPS = ('10.0.2.15',)

# Warning: Never ever ever use this in production
SECRET_KEY = "IT'S A SECRET TO EVERYBODY"

# Default paths for the Vagrant test environment
DATABASES["default"]["NAME"] = "/vagrant/media.db"
AUDIO_ROOT = "/vagrant/testtracks/"
TRANSCODE_ROOT = "/home/vagrant/transcodes/"
TRANSCODE_URL = "/static/music/"
ALBUMART_ROOT = "/home/vagrant/albumart/"
ALBUMART_URL = "/albumart/"

STATIC_ROOT = "/vagrant/"
STATICFILES_DIRS = [("music", TRANSCODE_ROOT)]
