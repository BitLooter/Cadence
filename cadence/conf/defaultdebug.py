import os

from settings_default import *

# Development (debug) settings

DEBUG = True
TEMPLATE_DEBUG = DEBUG

INSTALLED_APPS += ('debug_toolbar',)
