"""Global defaults for the project

Don't edit this file directly; instead, write a new module with your settings
and import this or one of the child defaults. For example, your debug.py may
look like this:

    from defaultdebug import *
    <Your local settings go here>

Then configure your server to use debug.py as your Django settings file.

This setup has the advantage of allowing you to write code like this:

    INSTALLED_APPS += ('debug_toolbar',)

All the defaults are available to you, you can simply add on or modify existing
settings without completely overriding them like the traditional
'from settings_local import *' approach does.
"""

#TODO: Document defaults here
#TODO: do we need contenttypes, messages, sessions?

import sys
import os

from django.conf.global_settings import *

# By default, project dir is the parent of this one
PROJECT_DIR = os.path.normpath(os.path.join(
                    os.path.dirname(os.path.abspath(__file__)), "..") )

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

USE_I18N = True
USE_L10N = True

ROOT_URLCONF = 'cadence.urls'

STATIC_ROOT = "/var/www/static/"
STATIC_URL = '/static/'

MEDIA_ROOT = "/var/www/media/"
MEDIA_URL = "media/"


TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, "templates"),
)

INSTALLED_APPS = (
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    'django.contrib.admindocs',
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

# Cadence settings
###################

INSTALLED_APPS += (
    'cadence.apps.player',
    'cadence.apps.backend',
)
from cadencedefaults import *
AUDIO_ROOT = os.path.join(MEDIA_ROOT, "media/music/")
AUDIO_URL = MEDIA_URL + "music/"
TRANSCODE_ROOT = os.path.join(MEDIA_ROOT, "media/transcodes/")
TRANSCODE_URL = MEDIA_URL + "transcodes/"
ALBUMART_ROOT = os.path.join(MEDIA_ROOT, "media/albumart/")
ALBUMART_URL = MEDIA_URL + "albumart/"
