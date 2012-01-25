from django.core.management.base import BaseCommand, CommandError
from html5media.backends.database.scanner import scan


class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(repr(scan()))
