DonateTk
===========

.. note::

  DonateTk is in Alpha phase. It's functional, but needs to be tested in "real" use-cases.
  This testing phase might bring up some issues that will then be resolved before it goes
  into Beta phase.


Introduction
------------

DonateTk offers a solution for putting up a donation page and
receiving donations. It consists of:

- a Django app that processes donation forms and collects donations (currently only via Stripe)
- a React app that shows a donation form (as well as a page for cancelling donations) and
  interacts with the Django app

The React app is intended to serve as an example and starting point for your custom donation page.
Of course, if you want, you can use the React application as it is, but it's recommended to  make your donation page
look unique and integrate it with your existing website.

In short, to use this solution, you should read the documentation about how the backend is
configured, and you should look at the source code of the React app to understand how the
form data is collected, how responses are processed and how cancelling donation works. You are
then free to use as much (or as little) of the frontend code as you like. To make it easier
to reuse the frontend code, I will discuss the different parts separately so you can
decide whether you want to reuse that part or build your own.
