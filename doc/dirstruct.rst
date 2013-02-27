Directory structure
===================

.. todo:: document structure


.. _transcode-filenames:

Transcode filenames
-------------------

You may have hundreds of source media files spread across dozens of directories
in your media folder. The scanner can automatically create transcodes of them
to maximize browser compatibility (e.g. MP3s and OGGs from FLACs). Cadence
places all these files in the transcodes directory, mangling the names to avoid
collisions. The name mangling looks like this:

    <Path>.<Original filename><Lossy transcode indicator>.<Profile>.<Extension>

These parts are defined like so:

Path
    Original path to the file, relative to :py:const:`AUDIO_ROOT`. Directory
    separators are changed to ``.`` (i.e. ``/`` and ``\\`` are replaced with ``.``).
Original filename
    The base filename of the transcode source.
Lossy transcode indicator
    If the source file is a lossy format, add ``.transcode`` here to indicate
    a conversion from a lossy source. You should really be using FLACs here,
    but you may not have a choice. Or maybe you just don't care, I won't judge.
    Out loud.
Profile
    Encoding profile used to generate this file - e.g. ``default``, ``hq``,
    ``xbox360``, ``fast``, etc.
Extension
    The extension appropriate for the filetype. For example, ``mp3``, ``ogg``,
    or even something like ``aac`` if you want to get fancy.

Example time: the file (relative to the audio root)
:file:`Weird Al/Parodies/Eat It.mp3` will have the name
:file:`Weird Al.Parodies.Eat It.transcode.ogg` in the transcode directory.
