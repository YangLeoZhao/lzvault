#!/usr/bin/env python
import os
import logging
import mongoengine
import tornado.ioloop
import tornado.web

from core.mapping import get_handlers
from tornado.options import define, options
from tornado.web import Application
from core.options import define_db

ENV_CONFIG = {
    'stage' : 'stage.conf',
    'prod' : 'prod.conf'
}

CUR_DIR = os.path.abspath(os.path.dirname(__file__))
logger = logging.getLogger('lzvault')

def _define():
    define('port', type=int, default=8888,
            help='Port nuber for the server to run on')
    define('env', default='stage', type=str,
            help='Environment to run the Webserver in')
    define('google_api_key', default='', type=str,
            help='Google Api key')
    define('open_weather_map_api_key', default='', type=str,
            help='Open Weather Map Api key')
    define_db()
    

def _config():
    if options.env:
        config_file = ENV_CONFIG.get(options.env)
        tornado.options.parse_config_file(
            os.path.join(CUR_DIR, 'config', config_file))

def db_config():
    mongoengine.connect(
        options.mongo_db, 
        host='mongodb://%s/lzvault'%options.mongo_host
        )

class Server(object):
    def __init__(self):
        self.application = None
        self._ioloop = None

    def start(self):
        logging.info('Initializing server..')
        _define()
        _config()
        tornado.options.parse_command_line()
        self.application = VaultApplication(get_handlers())
        self.application.listen(options.port)
        self._ioloop = tornado.ioloop.IOLoop.instance()
        db_config()
        try:
            logging.info('Starting server..')
            self._ioloop.start()
        except:
            logging.info('shutting down ..')

class VaultApplication(Application):
    def __init__(self, handlers):
        self.options = options
        settings = {
            "debug": True
        }
        super(VaultApplication, self).__init__(handlers, **settings)

if __name__ == '__main__':
    logging.basicConfig(
        format=('[%(asctime)s] %(levelname)s: %(filename)s '
                '%(lineno)d : %(message)s'),
        level=logging.INFO)
    server = Server()
    server.start()
    sys.exit(0)
