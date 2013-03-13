"""Common code for all transcoders.

If you are writing a new transcoder, you will generally want to extend
:py:class:`TranscodeManagerBase`. Most of the time you will only need to set
things up in :py:meth:`setup`, and the standard code will take care of
everything else. Specifically, you will need to call
:py:meth:`~TranscodeManagerBase.queue_job()` for each output transcode you
want to create, and :py:meth:`~TranscodeManagerBase.add_source_file()` if you
want to serve the source media file to users.
:py:meth:`~TranscodeManagerBase.convert()` takes care of encoding and profiles,
assuming you set the output filenames properly. You will also need to set the
class attribute :py:attr:`~TranscodeManagerBase.source_types` to a list of file
extensions the transcoder can take as input.

See the :ref:`transcoders` documentation for more information.
"""


import os
from django.conf import settings

# Encoding engine is defined in the settings, import it dynamically
encode = __import__(settings.ENCODER, fromlist=["encode"]).encode


class TranscodeManagerBase(object):
    """
    Base class for all transcoder managers.
    
    Code common to all (most?) transcoders. Not usable as-is, your subclasses
    define a ``setup()`` method to prepare the transcoder.
    
    :param str filename: Source filename.
    """
    
    #: Class attribute containing a list of file extensions the transcoder can
    #: handle.
    source_types = []
    
    def __init__(self, filename, mime=None):
        #: Input filename.
        self.filename = filename
        #: List of transcoder output filenames to be processed.
        self.pending_jobs = []
        #: List of all found transcoded media files.
        #: Formatted as (path, mimetype) pairs in a list.
        self.transcodes = []
        #: Source file for the media
        self.source = filename
        #: Source MIME type
        self.source_mime = self._mime_from_filename(filename) if mime is None else mime
        
        # Prepare the transcoder
        self.setup()

    def add_source_file(self):
        """Adds the source file as a media stream to serve"""

        linkname = self.make_transcode_name(self.source,
                                            os.path.splitext(self.source)[1],
                                            postfix_name=False)
        if not os.path.exists(linkname):
            os.symlink(self.source, linkname)
        self.transcodes.append((linkname, self.source_mime))

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
        mimetype = self._mime_from_filename(filename) if mime is None else mime
        transcode_info = (filename, mimetype)
        
        if os.path.exists(filename):
            self.transcodes.append(transcode_info)
        else:
            # Otherwise add it to the job list
            self.pending_jobs.append(transcode_info)
    
    def convert(self):
        """
        Executes a transcoding job.
        
        Runs through each item in :py:attr:`pending_jobs`, calling the encoder
        for each one. It's up to the encoder to determine codec parameters
        based on the information passed to it.
        """
        
        for outname, mimetype in self.pending_jobs:
            encode(self.source, outname, mimetype)
            self.transcodes.append((outname, mimetype))
    
    def make_transcode_name(self, path, newext, postfix_name=True):
        """
        Generates a transcoded filename from a given path.
        
        Output name is the basename prefixed with parent directory names,
        separated by periods. This keeps all transcodes in the same
        place, and also prevents name collisions. In addition to all this
        name mangling, it also replaces :py:const:`AUDIO_ROOT` with
        :py:const:`TRANSCODE_ROOT`.

        Example: If your source media is in ``/source/media/dir/`` and your
        transcodes are in ``/output/media/dir``, converting a FLAC named
        ``/source/media/dir/Jonathan Coulton/Code Monkey.flac`` to an MP3
        will result in an output filename of
        ``/output/media/dir/Jonathan Coulton.Code Monkey.mp3``.
        
        :param string path: The path of the source file
        :param string newext: New extension (file type) for the transcoded file
        :param bool postfix_name: If True, append `.transcode` to the filename
            (but before the extension)
        :returns: Output path
        """
        
        #TODO: add profile info in postscript
        if postfix_name:
            postfix = ".transcode"
        else:
            postfix = ""
        
        outname = path.replace(settings.AUDIO_ROOT, "").replace(os.sep, ".")
        outname = os.path.join(settings.TRANSCODE_ROOT,
                               os.path.splitext(outname)[0] + postfix + newext)
        return outname
    
    @property
    def transcode_needed(self):
        """Property that returns ``True`` if transcodes need to be performed."""
        return True if self.pending_jobs else False
    
    @property
    def files(self):
        """
        Property that returns filenames output by the transcoder.
        
        Data is in the form of a list of tuples, each tuple a triplet of three
        values containing the media's pathname (relative to its root defined
        in the settings), the URL used to access the media, and the MIME type.
        
        :returns: List of all output files
        """
        
        filelist = []
        
        for transcode in self.transcodes:
            relname = transcode[0].replace(settings.TRANSCODE_ROOT, "")
            filelist.append((relname, self._transcodeurl(transcode[0]), transcode[1], True),)
        
        return filelist
    
    def _transcodeurl(self, path):
        """Returns the URL used to access a given path (for transcoded files)"""
        return settings.TRANSCODE_URL + path.replace(settings.TRANSCODE_ROOT, "").replace(os.sep, "/")
    
    def _mime_from_filename(self, filename):
        """Detects MIME type from filename"""
        extension = os.path.splitext(filename)[1][1:]
        if extension == "mp3":
            mime = "audio/mp3"
        elif extension == "ogg":
            mime = "audio/ogg"
        elif extension == "flac":
            mime = "audio/flac"
        else:
            mime = None
        
        return mime
