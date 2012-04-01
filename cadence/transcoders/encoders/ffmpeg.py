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

# nullfile is useful for passing to external commands as stdout
nullfile = open(os.devnull)

def encode(inputFilename, outputFilename, mime, subtype=None):
    """
    Encodes inputFilename to outputFilename, in the codec given in mime.
    If subtype does not equal None (e.g. you may have varients for iPhones,
    consoles, set-top boxes, etc.) use it as part of the profile name.
    
    :param string inputFilename: File to encode
    :param string outputFilename: File to output
    :param string mime: Output type. Used to select profile.
    :param string subtype: Used to refine profile selection, if varients exist.
    """
    
    #TODO: Check for existance of ffmpeg?
    #TODO: Implement subtypes
    #TODO: Return success/fail/exceptions
    #TODO: Finish documenting this function
    command = 'ffmpeg -y -i "{}" -fpre "{}" "{}"'.format(
                inputFilename,
                os.path.join(settings.TRANSCODER_PROFILES_PATH,
                             settings.TRANSCODER_PROFILE,
                             mime.replace("/", "_") + ".ffpreset"),
                outputFilename)
    
    subprocess.call(command, stdout=nullfile, stderr=subprocess.STDOUT)