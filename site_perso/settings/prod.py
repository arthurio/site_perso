# Django settings for site_perso project.

from django.conf import settings
import json
with open('/home/dotcloud/environment.json') as f:
  env = json.load(f)

# Absolute path to the directory static files should be collected to.
# Don't put anything in this directory yourself; store your static files
# in apps' "static/" subdirectories and in STATICFILES_DIRS.
# Example: "/home/media/media.lawrence.com/static/"
STATIC_ROOT = '/home/dotcloud/data/static/'

# URL prefix for static files.
# Example: "http://media.lawrence.com/static/"
STATIC_URL = 'static/'
STATIC_REL_URL = '/home/dotcloud/data/static/'

# Additional locations of static files
STATICFILES_DIRS = (
)

