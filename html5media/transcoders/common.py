"""Common code for all transcoders.

If you area writing a new transcoder, you will generally want to extend
:py:class:`TranscodeManagerBase`. Most of the time you will only need to set
things up in :py:meth:`__init__`, and the standard code will take care of
everything else. Specifically, you will need to set the class attributes
:py:attr:`~TranscodeManagerBase.filename` to the source file,
:py:attr:`~TranscodeManagerBase.pending_jobs` to a list of output files
(:py:meth:`~TranscodeManagerBase.convert` takes care of encoding and profiles),
and :py:attr:`~TranscodeManagerBase.transcodes` to a list of transcoded media
already present in the filesystem. Additionally, set
:py:attr:`~TranscodeManagerBase.source_types` to a list of file extensions the
transcoder can take as input.

See the :ref:`transcoders` documentation for more information.

.. todo::
    Update subclass instructions when multiple source files are implemented
"""


import os
from django.conf import settings

# Encoding engine is defined in the settings, import it dynamically
encode = __import__("html5media.transcoders.encoders." + settings.ENCODER, fromlist=["encode"]).encode


class TranscodeManagerBase(object):
    """
    Base class for all transcoder managers
    
    Code common to all (most?) transcoders. As-is will perform a null
    transcoding job, make sure your subclasses define an __init__ to set things
    up.
    
    :param string filename: The path of the source file.
    
    .. py:attribute:: source_types
    
        Class attribute containing a list of file extensions the transcoder can
        handle.
    """
    
    source_types = []
    
    def __init__(self, filename):
        #: Input filename.
        self.filename = filename
        #: List of transcoder output filenames to be processed.
        self.pending_jobs = []
        #: List of all found transcoded media files.
        #: Formatted as (path, mimetype) pairs in a list.
        self.transcodes = []
        #TODO: Add sources[], to allow for multiple inputs
        #TODO: Split off setup code into separate method from __init__
        
        # Prepare the transcoder
        self.setup()
    
    def queue_job(self, filename, mime=None):
        """"""
        
        # If no mime type given, base it on the file extension
        if mime == None:
            mimetype = "audio/" + os.path.splitext(filename)[1][1:]
        else:
            mimetype = mime
        
        if os.path.exists(filename):
            self.transcodes.append( (filename, mimetype) )
        else:
            # Otherwise add it to the job list
            self.pending_jobs.append(filename)
    
    def convert(self):
        """Executes a transcoding job, if needed"""
        for job in self.pending_jobs:
            #TODO: A more extensive and flexible MIME system
            if job.endswith(".ogg"):
                newmime = "audio/ogg"
            elif job.endswith(".mp3"):
                newmime = "audio/mp3"
        
            encode(self.filename, job, newmime)
            self.transcodes.append( (job, newmime) )
    
    def make_transcode_name(self, path, newext, postfix_name=True):
        """
        Generates a transcoded filename from a given path.
        
        Output name is the basename prefixed with parent directory names,
        separated by periods. This keeps all transcodes in the same
        place, and also prevents name collisions. In addition to all this
        name mangling, it also replaces :py:const:`AUDIO_ROOT` with
        :py:const:`TRANSCODE_ROOT`.
        
        :param string path: The path of the source file
        :param string newext: New extension (file type) for the transcoded file
        :param bool postfix_name: If True, append `.transcode` to the filename
            (but before the extension)
        :returns: Output path
        """
        
        if postfix_name:
            postfix = ".transcode"
        else:
            postfix = ""
        
        # Note the slice, it strips away the initial path seperator
        outname = path.replace(settings.AUDIO_ROOT, "")[1:].replace(os.sep, ".")
        outname = os.path.join(settings.TRANSCODE_ROOT,
                               os.path.splitext(outname)[0] + postfix + newext)
        return outname
    
    @property
    def transcode_needed(self):
        """Returns ``True`` if transcodes need to be performed."""
        return True if self.pending_jobs else False
    
    @property
    def files(self):
        """
        Returns information about all files associated with the transcoder.
        
        Data is in the form of a list of tuples, each tuple a triplet of three
        values containing the media's pathname (relative to its root defined
        in the settings), the URL used to access the media, and the MIME type.
        """
        
        #TODO: figure out how to seperate source files that are servered and those that are not
        
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
