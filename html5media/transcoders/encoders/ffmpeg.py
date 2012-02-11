import os
import subprocess
from django.conf import settings

# nullfile is useful for passing to external commands as stdout
nullfile = open(os.devnull)

def encode(inputFilename, outputFilename, mime, subtype=None):
    """Encodes inputFilename to outputFilename, in the codec given in mime.
       If subtype does not equal None (e.g. you may have varients for iPhones,
       consoles, set-top boxes, etc.) use it as part of the profile name."""
    
    #TODO: Implement subtypes
    command = 'ffmpeg -y -i "{}" -fpre "{}" "{}"'.format(
                inputFilename,
                os.path.join(settings.TRANSCODER_PROFILES_PATH,
                             settings.TRANSCODER_PROFILE,
                             mime.replace("/", "_") + ".ffpreset"),
                outputFilename)
    
    subprocess.call(command, stdout=nullfile, stderr=subprocess.STDOUT)
