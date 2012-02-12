# transcoders/common.py - Common code for transcoder managers

import os
from django.conf import settings


class TranscodeManagerBase(object):
    """Base class for all transcoder managers"""
    
    def __init__(self, filename):
        self.filename = filename
    
    def make_transcode_name(self, path, newext):
        # Output name is the basename prefixed with parent directory names,
        # separated by periods. This keeps all transcodes in the same
        # place, and also prevents name collisions.
        
        # Note the slice, it strips away the initial path seperator
        outname = path.replace(settings.AUDIO_ROOT, "")[1:].replace(os.sep, ".")
        outname = os.path.join(settings.TRANSCODE_ROOT,
                               os.path.splitext(outname)[0] + ".transcode" + newext)
        
        return outname
    
    def _fileurl(self, path):
        """Returns the URL used to access a given path (for original files)"""
        return settings.AUDIO_URL + path.replace(settings.AUDIO_ROOT, "").replace(os.sep, "/")
    
    def _transcodeurl(self, path):
        """Returns the URL used to access a given path (for transcoded files)"""
        return settings.TRANSCODE_URL + path.replace(settings.TRANSCODE_ROOT, "").replace(os.sep, "/")
