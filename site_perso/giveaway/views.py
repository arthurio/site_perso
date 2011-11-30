from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.http import HttpResponseServerError

import simplejson
import logging

from site_perso.cv.forms import SendMailForm, JsonErrorList
from site_perso.cv import JsonResponse, send_me_mail

def giveaway(request):

    template_context = {}
    return render_to_response('giveaway_test.html', template_context, RequestContext(request))
