import webapp2
import os
from google.appengine.ext.webapp import template
from google.appengine.api import users
from google.appengine.ext import ndb

class Index(webapp2.RequestHandler):

	def get(self):
		user = users.get_current_user()

		if user:
			path = os.path.join(os.path.dirname(__file__), 'index.html')
			self.response.write(template.render(path, {'username': user.nickname()}))
		else:
			self.redirect(users.create_login_url(self.request.uri))

application = webapp2.WSGIApplication([
	('/', Index),
], debug = True)
