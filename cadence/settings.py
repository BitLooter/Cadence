# Default settings file
# It's recommended you do not edit this file directly, as it may be
# overwritten during upgrades. Instead, use settings_local.py to override
# these default settings.

import os

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

DEBUG = False
TEMPLATE_DEBUG = DEBUG

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(PROJECT_DIR, 'media.db'),
        'USER': '',
        'PASSWORD': '',
        'HOST': '',
        'PORT': '',
    }
}

SITE_ID = 1

SECRET_KEY = 'do_not_use_this_key'

USE_I18N = True
USE_L10N = True

ROOT_URLCONF = 'cadence.urls'

STATIC_ROOT = "/var/www/static/"
BASE_URL = '/' 
STATIC_URL = 'static/'
ADMIN_MEDIA_PREFIX = BASE_URL + STATIC_URL + 'admin/'

MEDIA_ROOT = "/var/www/media/"
MEDIA_URL = "media/"


TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.sites',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
    # Application apps
    'cadence.apps.player',
    'cadence.apps.backend',
)

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s - %(message)s'
        },
        'simple': {
            'format': '%(levelname)s - %(message)s'
        },
    },
    'handlers': {
        'null': {
            'level': 'DEBUG',
            'class': 'logging.NullHandler'
        },
        'file': {
            'level': 'DEBUG',
            'class': 'logging.FileHandler',
            'filename': os.path.join(PROJECT_DIR, 'log.txt'),
            'formatter': 'verbose'
        },
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler'
        }
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'apps': {
            'handlers': ['file'],
            'level': 'DEBUG',
            'propagate': True,
        },
    }
}

# Application settings
#######################

# Default paths are in subdirectories of the project directory
AUDIO_ROOT = os.path.join(MEDIA_ROOT, "music/")
AUDIO_URL = MEDIA_URL + "music/"
TRANSCODE_ROOT = os.path.join(MEDIA_ROOT, "transcodes/")
TRANSCODE_URL = MEDIA_URL + "transcodes/"
ALBUMART_ROOT = os.path.join(MEDIA_ROOT, "albumart/")
ALBUMART_URL = MEDIA_URL + "albumart/"

# Scanner settings
UNKNOWN_ALBUM = "<Unknown album>"
UNKNOWN_ARTIST = "<Unknown artist>"
# Transcoder settings
TRANSCODER = "cadence.transcoders.basic"
TRANSCODER_PROFILE = "default"
TRANSCODER_PROFILES_PATH = os.path.join(PROJECT_DIR, "transcoders", "profiles")
ENCODER = "ffmpeg"
SERVE_LOSSLESS = False


# Load settings local to this deployment
# If there is no settings_local, do nothing - the default configuration will
#  function, though it's almost certainly different from what you want.
try:
    from settings_local import *
except ImportError:
    pass
