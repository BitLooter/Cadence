from optparse import make_option

from django.core.management.base import NoArgsCommand, CommandError

from apps.backend import models


class Command(NoArgsCommand):
    """Django management command for clearing all database entries"""
    
    help = "Deletes all entries in the media database."
    option_list = NoArgsCommand.option_list + (
        make_option('-y',
            action='store_true', dest='force_yes', default=False,
            help='Autoselect yes on confirmation prompts.'),
    )
    
    def handle_noargs(self, **options):
        if options["force_yes"]:
            answer = "Y"
        else:
            print("\nAre you sure? This will delete EVERYTHING in the media database!")
            answer = raw_input("y/N: ")
        
        if answer.upper() == "Y":
            print("\nDeleting database...")
            models.Media.objects.all().delete()
            models.MediaSource.objects.all().delete()
            models.Playlist.objects.all().delete()
            models.Artist.objects.all().delete()
            models.Album.objects.all().delete()
        else:
            print("\nAborting database deletion.")
