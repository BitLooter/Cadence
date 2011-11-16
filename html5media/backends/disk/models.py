# Note that the disk backend does NOT use Django models, as data is read directly
# from the disk and there is no database involved.

import os
import urllib

def getPlaylist(name):
    files = os.listdir("C:/Develop/html5media/html5media/media/" + name)
    urls = ["/html5media/media/" + name + "/" + f for f in files if ".ogg" in f]
    playlist = []
    for pathname in urls:
        playlist.append( {"title": os.path.basename(pathname),
                          "url":   urllib.quote(pathname) } ) #NOTE: urllib.parse in Py3.x
    return playlist

def getPlaylistList():
    dirs = os.listdir("C:/Develop/html5media/html5media/media")
    return dirs
