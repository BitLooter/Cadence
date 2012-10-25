from django.shortcuts import render
from django.conf import settings
import logging

# Set up logging
logger = logging.getLogger("apps")


def index(request):
    logger.info("Home page requested from {}".format(request.get_host()))
    return render(request, "main.html.djt", {"title": settings.PLAYER_NAME})
