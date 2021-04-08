import typing as T
import uuid
from enum import Enum

from pydantic import BaseModel
from pydantic.networks import EmailStr


class PostDonationParams(BaseModel):
    amount: int
    email: EmailStr
    currency: T.Literal["usd", "eur"]
    recurrence: T.Literal["once", "monthly", "quarterly", "annually"]
    description: str
    stripe_token: str


class DeleteDonationParams(BaseModel):
    checksum: str


class ErrorCodes(Enum):
    CARD_DECLINED = 1
    ZIP_CODE_FAILED_VALIDATION = 2
    CVC_FAILED_VALIDATION = 3
    CARD_EXPIRED = 4
    ERROR_PROCESSING_CARD = 5
    AMOUNT_BELOW_MINIMUM = 6
    UNKNOWN = 999
