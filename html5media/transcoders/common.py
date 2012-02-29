"""Common code for all transcoders.

If you area writing a new transcoder, you will generally want to extend
:py:class:`TranscodeManagerBase`. Most of the time you will only need to set
things up in :py:meth:`setup`, and the standard code will take care of
everything else. Specifically, you will need to call
:py:meth:`~TranscodeManagerBase.add_source()` for every input file you would
like to make available as a streaming source, and
:py:meth:`~TranscodeManagerBase.queue_job()` for each output transcode you
want to create. :py:meth:`~TranscodeManagerBase.convert()` takes care of
encoding and profiles, assuming you set the output filenames properly.
You will also need to set the class attribute
:py:attr:`~TranscodeManagerBase.source_types` to a list of file extensions the
transcoder can take as input.

See the :ref:`transcoders` documentation for more information.
"""


import os
from django.conf import settings

# Encoding engine is defined in the settings, import it dynamically
encode = __import__("html5media.transcoders.encoders." + settings.ENCODER, fromlist=["encode"]).encode


class TranscodeManagerBase(object):
    """
    Base class for all transcoder managers.
    
    Code common to all (most?) transcoders. Not usable as-is, your subclasses
    define a ``setup()`` method to prepare the transcoder.
    
    :param list filenames: List of source filenames.
    """
    
    #: Class attribute containing a list of file extensions the transcoder can
    #: handle.
    source_types = []
    
    def __init__(self, filenames):
        #: Input filename.
        self.filenames = filenames
        #: List of transcoder output filenames to be processed.
        self.pending_jobs = []
        #: List of all found transcoded media files.
        #: Formatted as (path, mimetype) pairs in a list.
        self.transcodes = []
        #TODO: update these docs to reflect new role of transcodes/media
        #: List of all given media source files.
        #: Like :py:attr:`transcodes`, formatted as (path, mimetype) pairs.
        self.sources = []
        
        # Prepare the transcoder
        self.setup()
    
    def add_source(self, filename, mime=None):
        """
        Adds a file to the list of media sources.
        
        Any files you add will be added to :py:attr:`sources` and used
        unmodified in the final output file list. If no MIME type is specified,
        it will be autodetected based on the file extension.
        
        :param string filename: Path of the file
        :param string mime: MIME type of the file. Optional, will be autodetected
            if nothing is given.
        """
        
        #TODO: Move this to a dedicated function along with the code in queue_job
        # If no mime type given, base it on the file extension
        if mime == None:
            mimetype = "audio/" + os.path.splitext(filename)[1][1:]
        else:
            mimetype = mime
        
        self.sources.append( (filename, mimetype) )
    
    def queue_job(self, filename, mime=None):
        """
        Prepares a file for transcoding.
        
        If the file already exists, it is directly added to
        :py:attr:`transcodes`; if it does not, it's added to the
        :py:attr:`job queue <pending_jobs>`. If no MIME type is given, it is
        autodetected from the file extension.
        
        :param string filename: Path of the file to be made
        :param string mime: MIME type of the file. Optional, will be autodetected
            if nothing is given.
        """
        
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
        """
        Executes a transcoding job.
        
        Runs through each item in :py:attr:`pending_jobs`, calling the encoder
        for each one. It's up to the encoder to determine codec parameters
        based on the information passed to it.
        """
        
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
        
        :returns: List of all output files
        """
        
        output = []
        
        # Start with the source file(s)
        for source in self.sources:
            relname = source[0].replace(settings.AUDIO_ROOT, "")
            output.append( (relname, self._fileurl(source[0]), source[1]) )
        
        # Then add the transcode(s)
        for transcode in self.transcodes:
            relname = transcode[0].replace(settings.TRANSCODE_ROOT, "")
            output.append( (relname, self._transcodeurl(transcode[0]), transcode[1]) )
        
        return output
    
    def _fileurl(self, path):
        """Returns the URL used to access a given path (for source files)"""
        return settings.AUDIO_URL + path.replace(settings.AUDIO_ROOT, "").replace(os.sep, "/")
    
    def _transcodeurl(self, path):
        """Returns the URL used to access a given path (for transcoded files)"""
        return settings.TRANSCODE_URL + path.replace(settings.TRANSCODE_ROOT, "").replace(os.sep, "/")
