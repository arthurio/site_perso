from django.core.serializers import json, serialize
from django.db.models.query import QuerySet
from django.http import HttpResponse
from django.utils import simplejson
from types import NoneType, DictType
from django.core.mail import EmailMessage

class JsonResponse(HttpResponse):
    def __init__(self, object, status=None):
        if type(status) is not NoneType and type(object) is DictType:
            status_object = {}
            if not status:
                status_object.update({'errors': {}})
                status_object['errors'].update(object)
            else:
                status_object.update({'data':object})
            status_object.update({'status': status})
            object = status_object
        if isinstance(object, QuerySet):
            content = serialize('json', object)
        else:
            content = simplejson.dumps(
                object, indent=4, cls=json.DjangoJSONEncoder,
                ensure_ascii=False)
        super(JsonResponse, self).__init__(
            content, content_type='application/json')

def send_me_mail(first_name,last_name,email,message):
    msg = EmailMessage('Site perso', '<div>'+first_name+'&nbsp;'+last_name+'</div><div>'+email+'</div><div>'+message+'</div>', 'from@example.com', ['arthur.rio44@gmail.com'])
    msg.content_subtype = "html"
    msg.send(fail_silently=False)
