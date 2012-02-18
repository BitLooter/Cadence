"""
"""


import os

import basic


class TranscodeManager(basic.TranscodeManager):
    """Simple manager that provides OGGs and MP3s for every audio track"""
    
    source_types = [".flac", ".ogg", ".mp3"]
    
    def __init__(self, filename):
        #TODO: use an if, not a try, once a setup method is created
        try:
            basic.TranscodeManager.__init__(self, filename)
        except:
            #TODO: catch a real exception
            if self.filename.endswith(".flac"):
                transcodeOGG = self.make_transcode_name(self.filename, ".ogg", postfix_name=False)
                transcodeMP3 = self.make_transcode_name(self.filename, ".mp3", postfix_name=False)
                newtranscodes = (transcodeOGG, transcodeMP3)
            
            # Check both output filenames for possible transcoding
            for trans in newtranscodes:
                #TODO: this code has been used twice, maybe make a helper method?
                if os.path.exists(trans):
                    self.transcodes.append( (trans, "audio/" + trans[-3:] ) )
                else:
                    # Otherwise add it to the job list
                    self.pendingJobs.append(trans)
