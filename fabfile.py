from fabric.operations import local
from fabric.contrib.files import sed
from fabric.operations import prompt
from fabric.colors import red

from django.conf import settings

import os
import sys
os.environ['DJANGO_SETTINGS_MODULE'] = 'site_perso.settings.prod'

sys.path.append('./site_perso/')

def prepare():
    
    #collect static files
    local('cd site_perso/ && python manage.py collectstatic --noinput')

    folders_with_var = ['css','js','data']
    assets = ''
    #find all the assets which could be substituted
    for folder in folders_with_var:
        assets = assets + local('find site_perso/%s%s -type f' % (settings.STATIC_ROOT, folder),capture=True) + '\n'

    assets = assets.rstrip('\n')

    local('cp postinstall site_perso/assets/')


def clean():
    local('rm -Rf site_perso/%s' % settings.STATIC_ROOT)
    local('rm -Rf static')

def push():
    local('dotcloud push arthurapp --all')


def deploy():
    clean()
    prepare()
    push()
    clean()
