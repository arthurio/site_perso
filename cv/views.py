from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings 

import json

def cv(request):
    common = json.load(open('%s/data/common.json' % (settings.STATIC_REL_URL),'r'))
    if request.META.get('LANG') and request.META.get('LANG').count('fr') != 0:
        data = json.load(open('%s/data/fr.json' % (settings.STATIC_REL_URL),'r'))
    else:
        data = json.load(open('%s/data/en.json' % (settings.STATIC_REL_URL),'r'))

    template_context = {'common':common,'data':data}

    return render_to_response('index.html', template_context, RequestContext(request))
