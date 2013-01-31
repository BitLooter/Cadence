import logging
from django.conf import settings
from django.views.generic import TemplateView

# Set up logging
logger = logging.getLogger("apps")


class PlayerView(TemplateView):
    template_name = "main.html.djt"

    def dispatch(self, request, *args, **kwargs):
        logger.info("Home page requested from {}".format(request.get_host()))
        return super(PlayerView, self).dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = {"title": settings.PLAYER_NAME,
                   "default_playlist": settings.DEFAULT_PLAYLIST}
        return context
