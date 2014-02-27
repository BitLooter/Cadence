.. Cadence documentation master file, created by
   sphinx-quickstart on Tue Feb 14 20:45:13 2012.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

###################################
Welcome to Cadence's documentation!
###################################

************
Requirements
************

Other versions may work but are not tested.

* `Python 2.7 <http://www.python.org/>`_ (3.x support coming)
* `Django 1.6.1 <https://www.djangoproject.com/>`_
* `Mutagen 1.22 <https://code.google.com/p/mutagen/>`_
* `Sphinx 1.2.1 <http://sphinx-doc.org/>`_ with `sphinxcontrib-httpdomain 1.2.0 <http://pythonhosted.org/sphinxcontrib-httpdomain/>`_ (For building documentation)

************
Installation
************

[Not written yet]

*****
Usage
*****

[Scanner usage]

.. toctree::
   dirstruct

*********
Extending
*********

.. toctree::
   :maxdepth: 2
   
   extensions.rst

*****************
API documentation
*****************

Client/server interface
=======================

.. toctree::
   :maxdepth: 5
   
   api/restinterface


Internal APIs
=============

.. toctree::
   :maxdepth: 5
   
   api/cadence.apps
   api/cadence.transcoders
   api/cadence.transcoders.encoders

**************************
Documentation tasks/todo's
**************************

.. todolist::

******************
Indices and tables
******************

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`

