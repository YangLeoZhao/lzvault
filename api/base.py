import json
import requests
import logging

from enum import Enum
from tornado.web import RequestHandler
from tornado.options import options

class WEBSITE(Enum):
    Google = 1

class BaseApi(RequestHandler):
    def success(self, response):
        self.set_header("Content-type", "application/json")
        self.set_status(200)
        output = json.dumps(response)
        self.finish(output)

    def get_logged_in_user(self):
        return self.get_cookie('user', 'no one')

    def failure(self, response):
        self.set_header("Content-type", "application/json")
        self.set_status(400)
        output = json.dumps(response)
        self.finish(output)

    def GET(self, url, api_key_name=None):
        if not url:
            return 'GET request requires url to be passed in'
        api_key = options.as_dict().get(api_key_name)
        url = url + api_key

        try:
            res = requests.get(url).json()
        except Exception as e:
            print e
            return None
        return res

    def POST(self, url, data=None, files=None,):
        return requests.post(url, data, files)