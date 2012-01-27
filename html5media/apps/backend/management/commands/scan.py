from django.core.management.base import BaseCommand, CommandError
from html5media.apps.backend.scanner import scan


class Command(BaseCommand):
    def handle(self, *args, **options):
        self.stdout.write(repr(scan()))
