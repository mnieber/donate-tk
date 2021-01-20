"""Debug settings."""

from app.settings.base import *  # noqa

ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    },
}

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7$+s1ru#ho#@wu0hog+evpm642c_qn#+ev=p$)0by*y-n_*wjk'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 465
EMAIL_HOST_USER = '123nd456@gmail.com'
EMAIL_HOST_PASSWORD = 'P0Pajaiaj&7'
EMAIL_USE_TLS = False
EMAIL_USE_SSL = True
