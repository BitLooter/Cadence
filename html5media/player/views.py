from django.shortcuts import render_to_response
import logging

# Set up logging
logger = logging.getLogger("apps")

def index(request):
    logger.info("Home page requested from {}".format(request.get_host()))
    return render_to_response("main.html.djt", {})
