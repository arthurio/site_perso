from django.shortcuts import render_to_response
from django.template import RequestContext
from django.conf import settings
from django.http import HttpResponseServerError

import simplejson

from site_perso.cv.forms import SendMailForm, JsonErrorList
from site_perso.cv import JsonResponse, send_me_mail

def cv(request):
    common = simplejson.load(open('%sdata/common.json' % (settings.STATIC_REL_URL),'r'))
    if request.META.get('LANG') and request.META.get('LANG').count('fr') != 0:
        data = simplejson.load(open('%sdata/fr.json' % (settings.STATIC_REL_URL),'r'))
    else:
        data = simplejson.load(open('%sdata/en.json' % (settings.STATIC_REL_URL),'r'))

    template_context = {'common':common,'data':data}

    return render_to_response('index.html', template_context, RequestContext(request))

def mail(request):
    try:
        form = SendMailForm(request.POST, error_class=JsonErrorList)

        if form.is_valid():
            email = form.cleaned_data['email']
            first_name = form.cleaned_data['first_name']
            last_name = form.cleaned_data['last_name']
            message = form.cleaned_data['message']

            send_me_mail(first_name,last_name,email,message)

            return JsonResponse({},status=True)

        else:
            errors = {}
            for err in form.errors:
                errors.update({ err :form.errors[err]})

            return JsonResponse(errors,status=False)        
    except Exception as e:
        return HttpResponseServerError();
