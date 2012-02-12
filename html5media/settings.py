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

ROOT_URLCONF = 'html5media.urls'

BASE_URL = '/' 
STATIC_URL = 'static/'
ADMIN_MEDIA_PREFIX = STATIC_URL + 'admin/'


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
    'html5media.apps.player',
    'html5media.apps.backend',
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
AUDIO_ROOT = os.path.join(PROJECT_DIR, "static", "media")
AUDIO_URL = STATIC_URL + "media/"
TRANSCODE_ROOT = os.path.join(PROJECT_DIR, "static", "transcodes")
TRANSCODE_URL = STATIC_URL + "transcodes/"
ALBUMART_ROOT = os.path.join(PROJECT_DIR, "static", "albumart")
ALBUMART_URL = STATIC_URL + "albumart/"
# Scanner settings
UNKNOWN_ALBUM = "<Unknown album>"
UNKNOWN_ARTIST = "<Unknown artist>"
# Transcoder settings
TRANSCODER = "html5media.transcoders.basic"
TRANSCODER_PROFILE = "default"
TRANSCODER_PROFILES_PATH = os.path.join(os.path.dirname(os.path.normpath(__file__)),
                                        "transcoders", "profiles")
ENCODER = "ffmpeg"


# Load settings local to this deployment
# If there is no settings_local, do nothing - the default configuration will
#  function, though it's almost certainly different from what you want.
try:
    from settings_local import *
except ImportError:
    pass
