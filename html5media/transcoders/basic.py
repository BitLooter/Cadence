"""Simple transcoder that provides OGGs and MP3s for every audio track.

For every input OGG or MP3 file, creates (if necessary) a file of the other
type. This is a lossy conversion of course, but better than nothing if you do
not have a lossless source. If you do have that, you should consider using them
as the source files and :py:mod:`basicflac` as the transcoder.

.. note::
    MP3s and OGGs are enough to enable playback on every major browser.

.. todo::
    Write the basicflac transcoder
"""


import os

from common import TranscodeManagerBase


class TranscodeManager(TranscodeManagerBase):
    """Simple manager that provides OGGs and MP3s for every audio track"""
    
    source_types = [".ogg", ".mp3"]
    
    def __init__(self, filename):
        TranscodeManagerBase.__init__(self, filename)
        
        if self.filename.endswith(".ogg"):
            transcodename = self.make_transcode_name(self.filename, ".mp3")
            transcodemime = "audio/mp3"
        elif self.filename.endswith(".mp3"):
            transcodename = self.make_transcode_name(self.filename, ".ogg")
            transcodemime = "audio/ogg"
        else:
            #TODO: raise an error here
            pass
        # If the transcoded file already exists, add it to the list of transcodes
        if os.path.exists(transcodename):
            self.transcodes.append( (transcodename, transcodemime ) )
        else:
            # Otherwise add it to the job list
            self.pendingJobs.append(transcodename)
