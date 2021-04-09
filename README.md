# DonateTk

## Introduction

DonateTk is a small stack for a donation page that you can integrate into your own website.
It has a Django app for processing donations with Stripe, and a React frontend that can be
reused at different levels:

- at the lowest level, you only reuse the `api.ts` module to connect to the backend and build the rest
  of the frontend yourself
- at the intermediate levels, you reuse the page logic but not the visual React components
- at the highest level you reuse the visual components and only update the style-sheets

To aim of DonateTk is to reduce the effort that it would take software developers to build and publish a
donation page from weeks to days. In other words, it's a time-saver but not a turn-key solution. If you
have any feedback on how to make DonateTk easier to use and integrate, please create a Github issue.

## Note: this software is in Alpha phase

DonateTk is in Alpha phase. It's functional, but needs to be tested in real use-cases.
This testing phase might bring up some issues that will then be resolved before it goes
into Beta phase.

## Documentation

- [Introduction](https://github.com/mnieber/donate-tk/blob/1897c5f65606876bed42ed43b30509985aee7de1/doc/introduction.rst)
- [Installation and testing](https://github.com/mnieber/donate-tk/blob/1897c5f65606876bed42ed43b30509985aee7de1/doc/installation-and-testing.rst)
- [The Django app](https://github.com/mnieber/donate-tk/blob/1897c5f65606876bed42ed43b30509985aee7de1/doc/django-app.rst)
- [The React app](https://github.com/mnieber/donate-tk/blob/1897c5f65606876bed42ed43b30509985aee7de1/doc/react-app.rst)

## Features

- Supports Stripe (no other payment providers are supported at the moment)
- One-time and recurrent donations
- Multiple currencies (currently only USD and EUR)
- (Optional) Confirmation emails that contain links to cancel recurrent donations
- (Optional) Let the donor choose a designation
- (Optional) Let the donor subscribe to a newsletter
- The backend sends signals for donation events that other Django apps can listen to

## Screenshots

### The Amounts view

![alt text](https://github.com/mnieber/donate-tk/blob/abdb8e8fe288256b002c489d65787fb287a2c2a8/doc/img/AmountsView.png)

### The CreditCard view

![alt text](https://github.com/mnieber/donate-tk/blob/abdb8e8fe288256b002c489d65787fb287a2c2a8/doc/img/CreditCardView.png)

### The Address view

![alt text](https://github.com/mnieber/donate-tk/blob/abdb8e8fe288256b002c489d65787fb287a2c2a8/doc/img/AddressView.png)

### The Finish view

![alt text](https://github.com/mnieber/donate-tk/blob/abdb8e8fe288256b002c489d65787fb287a2c2a8/doc/img/FinishView.png)

## Roadmap

- Support PayPal
- Improve the default colour scheme and design
- Try it out in some real use-cases, collect feedback, improve.
- Add OpenAPI documentation

## Acknowledgement

The visual design was inspired by the `charity:water` donation page. Please visit their website to support their amazing work.
