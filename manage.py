#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # If a debugging configuration has not been set up, use the default debugging settings
    if os.path.exists(os.path.join(os.path.dirname(__file__), "cadence/conf/debug.py")):
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cadence.conf.debug")
    else:
        print "Debug configuration not found, using defaultdebug instead"
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cadence.conf.defaultdebug")
    
    from django.core.management import execute_from_command_line
    
    execute_from_command_line(sys.argv)
