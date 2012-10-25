"""Simple transcoder that provides OGGs and MP3s for every audio track.

For every input file of the supported types, creates (if necessary) an MP3 or
OGG. This may be a lossy conversion if no FLAC source is available, but better
than nothing if you do not have a lossless source.

.. note::
    MP3s and OGGs are enough to enable audio playback on every major browser.
"""


from django.conf import settings

from common import TranscodeManagerBase


class TranscodeManager(TranscodeManagerBase):
    """Simple manager that provides OGGs and MP3s for every audio track"""
    
    source_types = [".flac", ".ogg", ".mp3"]
    
    def setup(self):
        """Prepares the transcoder for building OGGs and MP3s for all media"""
        
        filename = self.filenames[0]
        
        if filename.endswith(".ogg"):
            newtranscodes = (self.make_transcode_name(filename, ".mp3"), )
            self.add_source(filename)
        elif filename.endswith(".mp3"):
            newtranscodes = (self.make_transcode_name(filename, ".ogg"), )
            self.add_source(filename)
        elif filename.endswith(".flac"):
            transcodeOGG = self.make_transcode_name(filename, ".ogg", postfix_name=False)
            transcodeMP3 = self.make_transcode_name(filename, ".mp3", postfix_name=False)
            newtranscodes = (transcodeOGG, transcodeMP3)
            # If the server is configured to serve lossless audio, make it a source
            if settings.SERVE_LOSSLESS:
                self.add_source(filename)
        else:
            #TODO: raise a better error here
            raise Exception()
        
        for trans in newtranscodes:
            self.queue_job(trans)
