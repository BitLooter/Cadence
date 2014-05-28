Cadence README
==============

<Introduction stuff>


Requirements
------------

<List software requirements here>


Quick Installation
------------------

Cadence should (mostly) work out of the box - all you need to do is configure
your server and a few settings to get a basic setup running. Basic instructions
are covered here, but if you're doing something more complex (e.g. integrating
Cadence into an existing site) you should consult the full documentation for
more extensive setup instructions. Actually, you should probably do that
anyways (especially before asking questions if/when something goes wrong), but
if you're the type of person who throws away the manual as soon as he opens the
box these should get you started quickly.

<INSTALLATION INSTRUCTIONS WILL GO HERE WHEN I FIGURE THEM OUT>


Note about the Django dev server
--------------------------------

Be warned that a few things don't work quite right on Django's dev server,
particularly when it comes to multimedia files. Known issues are outlined below:

* Chrome doesn't let you set arbritary seek locations on the dev server. This
  means seeking on the scrubber and the stop button are a no-go.
* Firefox won't even play from the dev server, as it requires MIME types on
  media files that the dev server doesn't supply.


Credits and thanks
------------------

* `Mutagen <http://code.google.com/p/mutagen/>`_ is used for tag handling in the
  scanner.
* The `Django <https://www.djangoproject.com/>`_ and `Python <http://python.org/>`_
  teams, without whose efforts I would be forced to use PHP.
* Source code and bug tracker hosting provided by `GitHub <https://github.com/>`_.
* 'Code Monkey' and 'I Feel Fantastic' are copyright
  `Jonathan Coulton <http://www.jonathancoulton.com/>`_. All music he has written is
  `CC BY-NC 3.0 licensed <http://www.jonathancoulton.com/faq/#Use>`_. Be sure to
  visit his web site and listen to them in way better quality than the included
  test tracks.
* Goat sound effect is copyright reinsamba and is under the
  `CC BY 3.0 license <http://creativecommons.org/licenses/by/3.0/>`_. Audio was
  originally obtained from
  `Freesound <https://www.freesound.org/people/reinsamba/sounds/57794/>`_.