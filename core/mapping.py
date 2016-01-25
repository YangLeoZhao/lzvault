import os
import api
import handlers as h

from tornado import web
from tornado.web import Application, URLSpec

def get_handlers():
    handler = [
        URLSpec(r'/', h.VaultHome),
        URLSpec(r'/static/(.*)', web.StaticFileHandler,{
            'path' : os.path.join(os.path.dirname(__file__), '../static')
            }),

        URLSpec(r'/find', h.Find),
        URLSpec(r'/resume', h.Resume),
        URLSpec(r'/terminal', h.Terminal),

        URLSpec(r'/api/display_position', api.displayPosition),
        URLSpec(r'/api/display_temperature', api.displayTemperature),
        URLSpec(r'/api/possible_mode', api.possibleMode),
        URLSpec(r'/api/select_mode', api.selectMode),
        URLSpec(r'/api/cur_mode', api.curMode),
        URLSpec(r'/api/task_finished', api.taskCompletion)
    ]

    return handler