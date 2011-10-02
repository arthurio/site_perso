from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings 

import simplejson

from cv.forms import SendMailForm, JsonErrorList
from cv import JsonResponse

import json

def cv(request):
    common = json.load(open('%s/data/common.json' % (settings.STATIC_REL_URL),'r'))
    if request.META.get('LANG') and request.META.get('LANG').count('fr') != 0:
        data = json.load(open('%s/data/fr.json' % (settings.STATIC_REL_URL),'r'))
    else:
        data = json.load(open('%s/data/en.json' % (settings.STATIC_REL_URL),'r'))

    template_context = {'common':common,'data':data}

    return render_to_response('index.html', template_context, RequestContext(request))


def mail(request):
    try:
        form = SendMailForm(request.POST, error_class=JsonErrorList)

        if form.is_valid():
            email = form.cleaned_data['email']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']

            cv.send_mail(first_name,last_name,email)

            return JsonResponse({},status=True)

        else:
            errors = {}
            for err in form.errors:
                errors.update({ err :form.errors[err]})

            return JsonResponse(errors,status=False)        
    except Exception as e:
        print e
