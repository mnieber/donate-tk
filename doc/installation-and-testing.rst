.. _installation:

Installation and testing
========================

The DonateTk project comes with `docker-compose` files that allow you to try it out.
To use it in your own project you should copy the DonateTk files into your project and
if necessary adapt them to your needs.


Trying out DonateTk
-----------------

To try DonateTk, first bring up the backend and frontend:

.. code-block:: bash

    # install dodo commands
    docker-compose up -f docker-compose.dev.yml

Now you can open the donation page at localhost:3000/donate/page. Since the backend uses the
development settings file it does not send any emails when a donation is processed. Instead,
you can open a shell in the docker container and inspect the email log files in
`/srv/donatetk/sent_emails/`.

Please check the `stripe testing page <https://stripe.com/docs/testing/>`_ for
details about checking with different card numbers.

.. tip::

    To debug the backend, you can follow these steps:

    1.a run `docker-compose down -f docker-compose.dev.yml`
    1.b change the backend command in `docker-compose.dev.yml` to `sleep infinity`
    1.a run `docker-compose up -f docker-compose.dev.yml`
    2.a open a shell in the backend container
    2.b run `pip install -r requirement.dev.txt`
    2.c add the line `__import__('pudb').set_trace()` to the `post` method in the `views.py` file
    2.d start the server with `make runserver`

    When the backend hits the breakpoint, a debug screen will appear in the shell window. Read the
    PUDB documentation for details on how to debug.


Installing the Django app
-------------------------

Currently there is no pip package and you are expected to install the donatetk Django app
by copying its directory directly into your Django project. Then you add the following packages
to `settings.INSTALLED_APPS`:

- rest_framework
- donatetk.apps.DonationTkConfig


Installing the React app
------------------------

To add the donation page to your frontend, choose a scenario as explained in :ref:`_react_app` and copy
the files you need to your own React project. Also inspect `src/app/components/UrlRouter.tsx` to see
how the route to `CancelDonationView` is configured, and how `DonationStateProvider` is used to provide
the donation state to the `DonationFormView`.


Running the backend tests
-------------------------

The tests can be executed by opening a shell in the backend container and
running `make install test`.


Inspecting donations
--------------------

DonateTk has no admin for inspecting the donations. Instead, you should use the Stripe admin console
for this purpose.
