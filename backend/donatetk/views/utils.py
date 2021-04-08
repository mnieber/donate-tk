import pydantic
from django.http import JsonResponse, QueryDict

from donatetk.schema import ErrorCodes
from donatetk.stripe_backend import StripeBackend


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


def _parse(request_data, schema):
    params, error_response = None, None
    try:
        params = schema(**request_data)
    except pydantic.error_wrappers.ValidationError as e:
        error_response = JsonResponse(
            dict(
                success=False,
                data=dict(
                    error_code=ErrorCodes.INVALID_QUERY_PARAMS.name, details=str(e)
                ),
            ),
            status=400,
        )
    return params, error_response


def _to_100_cents_unit(amount):
    return int(amount) / 100


def _create_stripe_backend():
    return StripeBackend()
