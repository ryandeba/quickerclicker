import webapp2
import os
from google.appengine.ext.webapp import template

class Index(webapp2.RequestHandler):

	def get(self):
		path = os.path.join(os.path.dirname(__file__), 'views/index.html')
		self.response.write(template.render(path, {}))

application = webapp2.WSGIApplication([
	('/', Index),
], debug = True)
