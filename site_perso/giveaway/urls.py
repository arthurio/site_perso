from django.conf.urls.defaults import patterns, include, url
from django.core.urlresolvers import reverse


urlpatterns = patterns('site_perso.giveaway.views',
    (r'^giveaway_test$', 'giveaway'),
)

