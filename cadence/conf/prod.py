import os

from defaultprod import *

# Production settings, local

TIME_ZONE = 'America/Los_Angeles'

SECRET_KEY = 'w+u!vatz60^t@+pocdm8%g!ps_)heb@aj$4g_ptiqnol^c4bdh'

STATIC_ROOT = "C:\\Develop\\htdocs\\cadence\\static"
STATIC_URL = "/cadence/static/"
MEDIA_ROOT = "C:\\Develop\\htdocs\\cadence\\media"

# Reset Cadence paths to the new MEDIA_ROOT
AUDIO_ROOT = os.path.join(MEDIA_ROOT, "music\\")
TRANSCODE_ROOT = os.path.join(MEDIA_ROOT, "transcodes\\")
ALBUMART_ROOT = os.path.join(MEDIA_ROOT, "albumart\\")
