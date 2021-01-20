"""Debug settings."""

from app.settings.base import *  # noqa

ALLOWED_HOSTS = ["*"]

CORS_ORIGIN_ALLOW_ALL = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": ":memory:",
    },
}

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "8fbc%#p8369y4%9wqky9a9d7+4m7183@)vz4#)9y#h8p)r7d(t"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

EMAIL_BACKEND = "django.core.mail.backends.filebased.EmailBackend"
EMAIL_FILE_PATH = "/srv/donatetk/sent_emails"
EMAIL_REPLY_ADDRESS = "info@donatetk.com"
