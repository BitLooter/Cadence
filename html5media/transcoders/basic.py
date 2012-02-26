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
    
    source_types = [".flac", ".ogg", ".mp3"]
    
    def setup(self):
        if self.filename.endswith(".ogg"):
            newtranscodes = (self.make_transcode_name(self.filename, ".mp3"), )
        elif self.filename.endswith(".mp3"):
            newtranscodes = (self.make_transcode_name(self.filename, ".ogg"), )
        elif self.filename.endswith(".flac"):
            transcodeOGG = self.make_transcode_name(self.filename, ".ogg", postfix_name=False)
            transcodeMP3 = self.make_transcode_name(self.filename, ".mp3", postfix_name=False)
            newtranscodes = (transcodeOGG, transcodeMP3)
        else:
            #TODO: raise a better error here
            raise Exception()
        
        # Check both output filenames for possible transcoding
        for trans in newtranscodes:
            self.queue_job(trans)
