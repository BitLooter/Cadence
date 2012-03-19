import os


AUDIO_ROOT = "/var/www/media/music/"
AUDIO_URL = "media/music/"
TRANSCODE_ROOT = "/var/www/media/transcodes/"
TRANSCODE_URL = "media/transcodes/"
ALBUMART_ROOT = "/var/www/media/albumart/"
ALBUMART_URL = "media/albumart/"

# Scanner settings
UNKNOWN_ALBUM = "<Unknown album>"
UNKNOWN_ARTIST = "<Unknown artist>"

# Transcoder settings
ENCODER = "ffmpeg"
SERVE_LOSSLESS = False
TRANSCODER = "cadence.transcoders.basic"
TRANSCODER_PROFILE = "default"
# Default directory structure leaves the profiles in ../transcoders/profiles from here.
# If you have rearranged things, naturally you will need to change this in the local settings.
thisdir = os.path.dirname(os.path.abspath(__file__))
TRANSCODER_PROFILES_PATH = os.path.normpath(
                                os.path.join(thisdir, "..", "transcoders", "profiles"))
