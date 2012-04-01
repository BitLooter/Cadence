#!/usr/bin/env python
import os
import sys

if __name__ == "__main__":
    #TODO: If debug doesn't exist, use defaultdebug
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "cadence.conf.debug")
    
    from django.core.management import execute_from_command_line
    
    execute_from_command_line(sys.argv)
