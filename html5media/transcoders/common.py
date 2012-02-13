# transcoders/common.py - Common code for transcoder managers

import os
from django.conf import settings
# Encoding engine is defined in the settings, import it dynamically
encode = __import__("transcoders.encoders." + settings.ENCODER, fromlist=["encode"]).encode


class TranscodeManagerBase(object):
    """
    Base class for all transcoder managers
    """
    
    def __init__(self, filename):
        """Basic manager setup. As-is will perform a null transcoding job,
           make sure your subclasses define an __init__ to set things up."""
        
        #: Input filename.
        self.filename = filename
        #: List of transcoder output filenames to be processed.
        self.pendingJobs = []
        #: List of all found transcoded media files.
        #: Formatted as (path, mimetype) pairs in a list.
        self.transcodes = []
        #TODO: Add sources[], to allow for multiple inputs
    
    def convert(self):
        """Executes a transcoding job, if needed"""
        for job in self.pendingJobs:
            #TODO: A more extensive and flexible MIME system
            if job.endswith(".ogg"):
                newmime = "audio/ogg"
            elif job.endswith(".mp3"):
                newmime = "audio/mp3"
        
            encode(self.filename, job, newmime)
            self.transcodes.append( (job, newmime) )
    
    def make_transcode_name(self, path, newext):
        """
        Generates a transcoded filename from a given path
        
        Output name is the basename prefixed with parent directory names,
        separated by periods. This keeps all transcodes in the same
        place, and also prevents name collisions. In addition to all this
        name mangling, it also replaces AUDIO_ROOT with TRANSCODE_ROOT.
        """
        
        # Note the slice, it strips away the initial path seperator
        outname = path.replace(settings.AUDIO_ROOT, "")[1:].replace(os.sep, ".")
        outname = os.path.join(settings.TRANSCODE_ROOT,
                               os.path.splitext(outname)[0] + ".transcode" + newext)
        return outname
    
    @property
    def transcode_needed(self):
        """Returns ``True`` if transcodes need to be performed."""
        return True if self.pendingJobs else False
    
    @property
    def files(self):
        """
        Returns information about all files associated with the transcoder.
        
        Data is in the form of a list of tuples, each tuple a triplet of three
        values containing the media's pathname (relative to its root defined
        in the settings), the URL used to access the media, and the MIME type.
        """
        
        # Start with the source file(s)
        relname = self.filename.replace(settings.AUDIO_ROOT, "")
        output = [(relname, self._fileurl(self.filename), "audio/" + relname[-3:])]
        
        # Then add the transcode(s)
        for transcode in self.transcodes:
            relname = transcode[0].replace(settings.TRANSCODE_ROOT, "")
            output.append( (relname, self._transcodeurl(transcode[0]), transcode[1]) )
        
        return output
    
    def _fileurl(self, path):
        """Returns the URL used to access a given path (for original files)"""
        return settings.AUDIO_URL + path.replace(settings.AUDIO_ROOT, "").replace(os.sep, "/")
    
    def _transcodeurl(self, path):
        """Returns the URL used to access a given path (for transcoded files)"""
        return settings.TRANSCODE_URL + path.replace(settings.TRANSCODE_ROOT, "").replace(os.sep, "/")
