from django.shortcuts import render_to_response
from django.template import RequestContext

def cv(request):
    template_context = {}
    return render_to_response('index.html', template_context, RequestContext(request))
