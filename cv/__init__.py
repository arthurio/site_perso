from django.core.serializers import json, serialize
from django.db.models.query import QuerySet
from django.http import HttpResponse
from django.utils import simplejson
from types import NoneType, DictType

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

def send_mail(first_name,last_name,email):
    print first_name
