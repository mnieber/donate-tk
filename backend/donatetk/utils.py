from django.http import QueryDict


def get_post_data(request):
    method = request.META.get("REQUEST_METHOD", "").upper()
    POST = None
    FILES = None
    if method in ["PUT", "DELETE"]:
        content_type = request.META.get("CONTENT_TYPE", "")
        if content_type.startswith("multipart"):
            POST, FILES = request.parse_multipart(request.META, request)
        elif content_type.startswith("application/x-www-form-urlencoded"):
            POST = QueryDict(request.body, encoding=request._encoding)
    return POST, FILES
