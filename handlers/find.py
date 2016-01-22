from tornado.web import RequestHandler

class Find(RequestHandler):
    def get(self):
        self.render('../templates/find.html')