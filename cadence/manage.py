#!/usr/bin/env python
import os
import sys

from django.core.management import execute_manager

import conf.debug as settings

# Append the absolute normalized parent directory of this file to the path
thisdir = os.path.dirname(os.path.abspath(__file__))
sys.path.append( os.path.normpath(os.path.join(thisdir, "..")) )

if __name__ == "__main__":
    execute_manager(settings)
