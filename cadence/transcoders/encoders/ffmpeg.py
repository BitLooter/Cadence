"""FFmpeg-based encoder.

Makes use of `FFmpeg <http://ffmpeg.mplayerhq.hu/>`_ to transcode media.
Obviously you will need Fmpeg installed on your system for this to work, and
it will need to be compiled with support for any codecs you will want to use.
As it calles FFmpeg on the command line, you do not need the development
libraries installed, just the command-line encoder available on the path.

This encoder makes use of profiles/presets to set encoding parameters, see
:ref:`encoders` for more information.

.. note::
    If PyFFmpeg ever supports encoding, this module may be updated to make use
    of it instead of the command-line version. Until then, it's CLI all the way.
"""


import os
import subprocess
from django.conf import settings
import logging

logger = logging.getLogger("cadence.encoder")

# nullfile is useful for passing to external commands as stdout
nullfile = open(os.devnull)


def encode(input_filename, output_filename, mime, subtype=None):
    """
    Encodes input_filename to output_filename, in the codec given in mime.
    If subtype does not equal None (e.g. you may have varients for iPhones,
    consoles, set-top boxes, etc.) use it as part of the profile name.
    
    :param string input_filename: File to encode
    :param string output_filename: File to output
    :param string mime: Output type. Used to select profile.
    :param string subtype: Used to refine profile selection, if varients exist.
    """
    
    #TODO: Implement subtypes
    #TODO: Return success/fail/exceptions
    #TODO: Finish documenting this function
    preset = os.path.join(settings.ENCODER_PROFILES_PATH,
                          settings.ENCODER_PROFILE,
                          mime.replace("/", "_") + ".ffpreset")
    command = ["ffmpeg", "-y", "-i", input_filename, "-fpre", preset, output_filename]

    try:
        subprocess.call(command, stdout=nullfile, stderr=subprocess.STDOUT)
    except OSError as e:
        # If the command isn't found, ffmpeg isn't available on this machine
        if e.errno == 2:
            logger.error("ffmpeg not found")
            #TODO: raise a better error here
            raise
