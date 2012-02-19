Writing <NAME> Extensions
=========================

<Intro text>

.. todo:: Document included extensions


.. _transcoders:

Transcoders
-----------

The transcoder's job is to take one or more input files and create files
suitably encoded for playback in browsers. Some default transcoders are
included that provide basic browser compatibility, but if they do not provide
the functionality you require it's very easy to write your own.

Most of the time, you will only need to subclass
:py:class:`~html5media.transcoders.common.TranscodeManagerBase`, set up
details in ``__init__``, and set
:py:class:`~html5media.transcoders.common.TranscodeManagerBase.source_types`
to a list of valid input formats. Encoding and other tasks can normally be
handled by the base class; you can always redefine individual methods if they
are not sufficient for whatever you're doing.

Transcoding process
^^^^^^^^^^^^^^^^^^^

To write a new transcoder, it helps to understand the transcoding process.

First, the scanner walks over the directory tree, and makes a list of every
file the transcoder can handle. After doing some internal processing, it then
loops over every file, creating a new transcoder manager (using the transcoder
defined in the settings) for each one.

The scanner then checks if a transcode is needed, and if so does that. Once the
encoding process completes, it uses the output information from the transcoder
to create the database entries.

Writing a new transcoder
^^^^^^^^^^^^^^^^^^^^^^^^

In short, when writing a new transcoder module here's what needs to be done:

* Set the :py:class:`~html5media.transcoders.common.TranscodeManagerBase`
  class attribute
  :py:class:`~html5media.transcoders.common.TranscodeManagerBase.source_types`
  to a list of valid input types
* During ``__init__``:
   * Set :py:class:`~html5media.transcoders.common.TranscodeManagerBase.pending_jobs`
     to a list of output files that need to be created.
     :py:class:`~html5media.transcoders.common.TranscodeManagerBase.convert` is
     smart enough to figure out the codec and profile to use from the name, if
     it follows the standard format.
   * Initialize :py:class:`~html5media.transcoders.common.TranscodeManagerBase.transcodes`
     to a list of transcoded files that already exist. Used when updating a
     previously scanned set so it doesn't need to reencode everything.

That's it, the rest should be automatic. Specifically, the default behaviour:

* :py:class:`~html5media.transcoders.common.TranscodeManagerBase.transcode_needed`
  returns ``True`` if
  :py:class:`~html5media.transcoders.common.TranscodeManagerBase.pending_jobs`
  is not an empty list.
* :py:class:`~html5media.transcoders.common.TranscodeManagerBase.files` is the
  list of files for the scanner to add to the database, normally some
  combination of the source files and the transcodes.

.. todo:: document filename format
.. todo:: pendingJobs may change at some point (its name or contents)
.. todo:: document output filename format
.. todo:: fix docs when multiple source files are implemented
.. todo:: add note about the encoder when overriding convert()


.. _encoders:

Encoders
--------

To write an encoder, simply create a new module with a function named encode,
and place it in the <PATH> directory. encode() can call another program, an
external library, implement an MPEG-4 encoder entirely in hand gestures,
whatever you want so long as it matches the following function signature:

.. todo:: document signature here



.. todo:: formatting
.. todo:: document return status stuff, when implemented
