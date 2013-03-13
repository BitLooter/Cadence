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
        
        if self.source.endswith(".ogg"):
            self.queue_job(self.make_transcode_name(self.source, ".mp3"))
            self.add_source_file()
        elif self.source.endswith(".mp3"):
            self.queue_job(self.make_transcode_name(self.source, ".ogg"))
            self.add_source_file()
        elif self.source.endswith(".flac"):
            self.queue_job(self.make_transcode_name(self.source, ".ogg", postfix_name=False))
            self.queue_job(self.make_transcode_name(self.source, ".mp3", postfix_name=False))
            # If the server is configured to serve lossless audio, make it a source
            if settings.SERVE_LOSSLESS:
                self.add_source_file()
        else:
            #TODO: raise a better error here
            raise Exception()
