from django import forms
from django.contrib.auth.models import User
from django.forms.util import ErrorList

import re
import logging
from urlparse import urlparse


class SendMailForm(forms.Form):
    email = forms.EmailField(max_length=75,required=True,error_messages={'invalid': (u'Invalid email address')})
    first_name = forms.CharField(max_length=30,required=True)
    last_name = forms.CharField(max_length=30,required=True)
    message = forms.CharField(min_length=10,max_length=1000,required=True)
 
    def clean_first_name(self):
        first_name = self.cleaned_data['first_name']
        if not first_name.strip():
            raise forms.ValidationError('This field is required.')
        else:
            return first_name

    def clean_last_name(self):
        last_name = self.cleaned_data['last_name']
        if not last_name.strip():
            raise forms.ValidationError('This field is required.')
        else:
            return last_name

    def clean_message(self):
        message = self.cleaned_data['message']
        if not message.strip():
            raise forms.ValidationError('This field is required.')
        else:
            return message


class JsonErrorList(ErrorList):
    def __unicode__(self):
        return self.as_json()

    def as_json(self):
        if not self: return u''
        return u','.join([u'["%s"]' % e for e in self])
