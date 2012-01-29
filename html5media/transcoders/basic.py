# transcoders/basic.py
# Simple transcoder module that ensures each audio file has an ogg and mp3 version

import os
import subprocess
from django.conf import settings

from common import TranscodeManagerBase

class TranscodeManager(TranscodeManagerBase):
    """Simple manager that provides OGGs and MP3s for every audio track"""
    
    def __init__(self, filename):
        TranscodeManagerBase.__init__(self, filename)
        self._transcodes = []
        if self.filename.endswith(".ogg"):
            self._transcodename = self.make_transcode_name(self.filename, ".mp3")
        elif self.filename.endswith(".mp3"):
            self._transcodename = self.make_transcode_name(self.filename, ".ogg")
        else:
            #TODO: raise an error here
            pass
        # If the transcoded file already exists, add it to the list of transcodes
        if os.path.exists(self._transcodename):
            self._transcodes.append( (self._transcodename,
                                      "audio/" + self._transcodename[-3:]) )
    
    def convert(self):
        """Executes a transcoding job, if needed"""
        
        # This basic transcoder creates MP3s out of OGGs, and vice versa.
        if self.filename.endswith(".ogg"):
            command = 'ffmpeg -y -i "{}" -acodec libmp3lame -ab 128k "{}"'.format(self.filename,
                                                                                  self._transcodename)
            newmime = "audio/mp3"
        elif self.filename.endswith(".mp3"):
            command = 'ffmpeg -y -i "{}" -acodec libvorbis -ab 128k "{}"'.format(self.filename,
                                                                                 self._transcodename)
            newmime = "audio/ogg"
        
        #TODO: create transcode() method on base class to handle encoding
        subprocess.call(command, stdout=self.nullfile, stderr=subprocess.STDOUT)
        self._transcodes.append( (self._transcodename, newmime) )
    
    @property
    def transcode_needed(self):
        return not os.path.exists(self._transcodename)
    
    @property
    def files(self):
        """Returns information about all files associated with the transcoder"""
        #TODO: _transcodes could probably be tweaked to make this function simpler
        relname = self.filename.replace(settings.AUDIO_ROOT, "")
        output = [(relname, self._fileurl(self.filename), "audio/" + relname[-3:])]
        for transcode in self._transcodes:
            relname = transcode[0].replace(settings.TRANSCODE_ROOT, "")
            output.append( (relname, self._transcodeurl(transcode[0]), transcode[1]) )
        return output
