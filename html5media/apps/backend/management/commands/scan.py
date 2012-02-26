from optparse import make_option

from django.core.management.base import NoArgsCommand, CommandError
from html5media.apps.backend.scanner import Scanner


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
        scanner.scan()
