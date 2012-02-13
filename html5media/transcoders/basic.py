# transcoders/basic.py
# Simple transcoder module that ensures each audio file has an ogg and mp3 version

import os

from common import TranscodeManagerBase


class TranscodeManager(TranscodeManagerBase):
    """Simple manager that provides OGGs and MP3s for every audio track"""
    
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
