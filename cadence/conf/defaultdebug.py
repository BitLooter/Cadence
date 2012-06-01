"""Default settings for the debug configuration

Intended for use with the runserver command."""

import os

from settings_default import *


DEBUG = True
TEMPLATE_DEBUG = DEBUG

INTERNAL_IPS = ('127.0.0.1',)
