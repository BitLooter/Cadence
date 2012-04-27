"""
Global defaults for the project
===============================

Don't edit this file directly; instead, write a new module with your settings
and import this or one of the child defaults. For example, your debug.py may
look like this::

    from defaultdebug import *
    <Your local settings go here>

Then configure your server to use debug.py as your Django settings file.

This setup has the advantage of allowing you to write code like this::

    INSTALLED_APPS += ('debug_toolbar',)

All the defaults are available to you, you can simply add on or modify existing
settings without completely overriding them like the traditional
'from settings_local import *' approach does.

What to configure
-----------------

Besides the usual Django settings like STATIC_ROOT and SECRET_KEY, there are a
few Cadence-specific settings you will need to configure.

See the documentation or the cadencedefaults module for details on the settings
used by Cadence.
"""

#TODO: Document defaults here

import sys
import os

from django.conf.global_settings import *

# By default, project dir is the parent of this one
PROJECT_DIR = os.path.normpath(os.path.join(
                    os.path.dirname(os.path.abspath(__file__)), "..") )

DEBUG = False
TEMPLATE_DEBUG = DEBUG

# If no database is specified, default is an SQLite database in the project dir
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

USE_TZ=True

ROOT_URLCONF = 'cadence.urls'

# Set up some sane directory defaults, based on a Debian/Ubuntu-style Linux system
STATIC_ROOT = "/var/www/static/"
STATIC_URL = '/static/'

MEDIA_ROOT = "/var/www/media/"
MEDIA_URL = "media/"

# Add the templates in the project directory
TEMPLATE_DIRS = (
    os.path.join(PROJECT_DIR, "templates"),
)

# The default apps needed by Cadence
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

MIDDLEWARE_CLASSES += ('django.middleware.clickjacking.XFrameOptionsMiddleware',)

# Configure the logging system to write to a 'log.txt' file in the project dir
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

# Defaults are stored in a separate module to ease use with existing sites
from cadencedefaults import *
