# converter.py - Handles media transcoding

import os
import subprocess
from django.conf import settings


def transcode(filename):
    if ".mp3" in filename:
        print("Transcode: " + filename)
        transcodePath = "C:\\Develop\\html5media\\html5media\\static\\transcodes"
        outputName = "{}.transcode.ogg".format(
                            os.path.join(transcodePath,
                                         os.path.splitext(os.path.basename(filename))[0]))
        if not os.path.exists(outputName):
            subprocess.call('ffmpeg -y -i "{}" -acodec libvorbis -ab 128k "{}"'.format(filename, outputName),
                        stdout=open(os.devnull, "w"), stderr=subprocess.STDOUT)
        outputUrl = settings.STATIC_URL + "transcodes/" + outputName.replace(transcodePath, "").replace("\\", "/")
    else:
        outputName = filename
        outputUrl = settings.AUDIO_URL + outputName.replace(settings.AUDIO_ROOT, "").replace("\\", "/")
    
    return outputUrl
