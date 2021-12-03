# Hotel Booking REST API documentation

To work with the MotoPress Hotel Booking REST API, you must go through authentication.\
The following authentication methods are supported:
* `Basic Auth`
* `OAuth 1`

To authenticate, you are required to have two access tokens:
* `consumer_key`
* `consumer_secret`

You can create access tokens in the administrator dashboard:
*Accommodation > Settings > Advanced*

In the REST API responses, you can see response-related links.
For the better REST API usability and performance, some links can be embeddable resources.

To get an extended response with embedded resources in the request, add the GET parameter `_embed`.

Specify the list of IDs required for embedding links separated by commas.

Or add `_embed` = `true` to embed all related resources.

## Try it out

1. Create your demo site.
1. Follow <a href="https://hbdemo.getmotopress.com/" target="_blank">this link</a> and click the `Start Free Trial` button.
1. Confirm the creation of your site via email.
1. Fill in the `demo-id` field using a `url` value of your created demo site.
1. Log in.
1. Create access tokens in the administration dashboard: **Accommodation > Settings > Advanced**

To log in, click the `Authorize` button and use the `username` and `password` credentials from your email.

Fill in these fields:
* **Username** &mdash; `consumer_key`
* **Password** &mdash; `consumer_secret`
