from django.core.signing import Signer


def checksum_from_subscription(subscription):
    signer = Signer()
    return signer.sign(subscription.customer + subscription.id).split(":")[1]


def verify_checksum(checksum, customer_id, subscription_id):
    signer = Signer()
    signed_value = ":".join([customer_id + subscription_id, checksum])
    signer.unsign(signed_value)
