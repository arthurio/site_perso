from django.conf.urls.defaults import patterns, include, url
from django.core.urlresolvers import reverse


urlpatterns = patterns('site_perso.cv.views',
    (r'^$', 'cv'),
    url(r'^mail$', 'mail', name='mail'),
    (r'^robots.txt$', 'robots'),
)
