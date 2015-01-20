"""
Default settings for Cadence
============================

Simply use "from cadencedefaults import *" in your settings environment to get
the default settings ready. You will also need to add `cadence.apps.player`
and `cadence.apps.backend` to your `INSTALLED_APPS`.

Settings you may need to manually configure
-------------------------------------------

PLAYER_NAME
    Name of the web site, or at least the Cadence player part if you're
    incorporating it into an existing site.
DEFAULT_PLAYLIST
    ID of the playlist to use on page load. `None` for no playlist.

Path settings
~~~~~~~~~~~~~

Make sure all paths (filesystem and URL) end in a slash.

AUDIO_ROOT
    Filesystem path where your source music file sources are located.
TRANSCODE_ROOT
    Filesystem path where your media transcodes go. Your server doesn't need
    write privileges here, but the user running the transcoder/scanner does.
    Unless you enjoy watching things not work.
TRANSCODE_URL
    Root URL for the transcodes. The filesystem structure here should be the
    same as `TRANSCODE_ROOT` - ideally, you're just serving the
    `TRANSCODE_ROOT` directory.
ALBUMART_ROOT
    Filesystem path for your album art.
ALBUMART_URL
    Root URL for Album art. Like `TRANSCODE_URL`, paths should map the same as
    `ALBUMART_ROOT` paths.

Scanner settings
~~~~~~~~~~~~~~~~

UNKNOWN_ALBUM
    Name to use for albums with a blank or missing album tag.
UNKNOWN_ARTIST
    Name to use for albums with a blank or missing artist tag.

Transcoder settings
~~~~~~~~~~~~~~~~~~~

TRANSCODER
    Transcoder module the scanner should use. Should be a string with the fully
    qualified module name.
ENCODER
    Which encoder the transcoder should use. Should be a string with the fully
    qualified module name.
ENCODER_PROFILE
    Profile set for the transcoder. Note that different transcoders may not
    share profiles, so for example profiles built for ffmpeg will not work with
    a SOX transcoder.
ENCODER_PROFILES_PATH
    Filesystem path where profiles are stored. By default ../transcoders/profiles,
    relative to this file.
SERVE_LOSSLESS
    Boolean indicating if lossless files should be served to users. By default,
    they are only used as original masters and are not sucking up all your
    bandwidth. If for some reason you want to serve up FLACs, set this to `True`.
    Note that this setting takes effect at scan time, you'll need to update your
    datebase after setting this.
"""

import os


PLAYER_NAME = "Cadence Media Player"
DEFAULT_PLAYLIST = None

AUDIO_ROOT = "/var/www/media/music/"
TRANSCODE_ROOT = "/var/www/media/transcodes/"
TRANSCODE_URL = "media/transcodes/"
ALBUMART_ROOT = "/var/www/media/albumart/"
ALBUMART_URL = "media/albumart/"

# Scanner settings
UNKNOWN_ALBUM = "<Unknown album>"
UNKNOWN_ARTIST = "<Unknown artist>"

# Transcoder settings
SERVE_LOSSLESS = False
TRANSCODER = "cadence.transcoders.basic"
ENCODER = "cadence.transcoders.encoders.ffmpeg"
ENCODER_PROFILE = "default"
# Default directory structure leaves the profiles in ../transcoders/profiles from here.
# If you have rearranged things, naturally you will need to change this in the local settings.
thisdir = os.path.dirname(os.path.abspath(__file__))
ENCODER_PROFILES_PATH = os.path.normpath(
    os.path.join(thisdir, "..", "transcoders", "profiles"))
