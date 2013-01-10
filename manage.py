#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    # If a debugging configuration has not been set up, use the default debugging settings
    try:
        import cadence.conf.debug
        # Only executes if the above module is present
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cadence.conf.debug")
    except ImportError:
        # Default module if the debug settings module is not found
        print("Debug configuration not found, using defaultdebug instead")
        os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cadence.conf.defaultdebug")
    
    from django.core.management import execute_from_command_line
    
    execute_from_command_line(sys.argv)
