from django.conf import settings
from django.conf.urls import include, re_path
from django.conf.urls.static import static

import donatetk.urls

urlpatterns = [
    re_path(r"^api/", include(donatetk.urls)),
]
