from tornado.web import RequestHandler

class VaultHome(RequestHandler):
    def get(self):
        self.render('../templates/home.html')