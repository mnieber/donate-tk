import json

import pydantic
from django.http import JsonResponse, QueryDict

from donatetk.schema import ErrorCodes


def get_post_data(request):
    method = request.META.get("REQUEST_METHOD", "").upper()
    if method in ["POST", "PUT", "DELETE"]:
        content_type = request.META.get("CONTENT_TYPE", "")
        if content_type.startswith("multipart"):
            POST, _ = request.parse_multipart(request.META, request)
            return POST
        elif content_type.startswith("application/x-www-form-urlencoded"):
            return QueryDict(request.body, encoding=request._encoding).dict()
        elif content_type.startswith("application/json"):
            return json.loads(request.body.decode("UTF-8"))
    return None


def parse_params(request_data, schema):
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
