from django.shortcuts import render_to_response
import os   #TODO: decouple data/view

def index(request):
    #TODO: decouple data/view
    files = os.listdir("C:/Develop/html5media/html5media/main/static/")
    files = [f.replace(" ", "%20") for f in files if ".ogg" in f]
    return render_to_response("main.html.djt", {"media": files})
