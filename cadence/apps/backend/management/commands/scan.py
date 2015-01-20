import os.path
from optparse import make_option

from django.core.management.base import NoArgsCommand
from django.conf import settings
from cadence.apps.backend.scanner import Scanner

class Command(NoArgsCommand):
    """Django management command for scanning media files"""
    
    help = "Scans the directories specified in your Django settings for media files."
    option_list = NoArgsCommand.option_list + (
        make_option('-f', '--force-transcode',
            action='store_true', dest='force_transcode', default=False,
            help='The scanner will transcode media even if transcodes are already present, overwriting existing files.'),
    )
    
    def handle_noargs(self, **options):
        scanner = Scanner(options)
        try:
            scanner.scan()
        except OSError as e:
            if e.errno == 2 and e.filename == settings.ALBUMART_ROOT:
                # Unable to access album art directory
                print("Can't read ALBUMART_ROOT directory - does it exist?")
            elif not os.path.exists(settings.TRANSCODE_ROOT):
                # Unable to write into TRANSCODE_ROOT directory
                print("TRANSCODE_ROOT directory does not exist")
            else:
                # Some other missing path error
                print("OSError on path '{}'".format(e.filename))
                raise
