from tornado.web import RequestHandler

class Terminal(RequestHandler):
    def get(self):
        self.render('../templates/terminal.html')