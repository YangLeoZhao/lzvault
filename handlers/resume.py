from tornado.web import RequestHandler

class Resume(RequestHandler):
    def get(self):
        self.render('../templates/resume.html')