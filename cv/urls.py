from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('site_perso.cv.views',
    (r'^$', 'cv'),
)
