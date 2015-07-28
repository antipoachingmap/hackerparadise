## Anti Poaching App

This app is designed to facilitate communication about recent poaching events in Zimbabwe.

Ruby on rails is used to provide a series of endpoints for the following major uses:
* Allow anti-poaching units in the field to report incidents via SMS and a simple web form
* Provide a public endpoint with a feed of data about the poaching incidents
* Serve a simple page to indicate incidents with dirty data and a manual mechanism for fixing the data

A simple display of the data is rendered with leafletjs. This page hits the rails backend for data about the poaching events.

A full wordpress site is used as a companion to this app, where the simple feed display is integrated into a page within wordpress.


## Development

## Testing

### SMS functionality

The twilio api is integrated into this app to allow units in the field to text a phone number with a report. To set this up, you need to purchase a twilio phone number and set the webhook.

The endpoint to set in twilio is ` /twilio/sms `. So if you deploy to heroku, you could set the webhook to something like: `http://hidden-fjord-7117.herokuapp.com/twilio/sms`

One good way of testing the sms functionality is against a locally running server via `ngrok`.
* Start the server via `rails server` (make sure postgres is running)
* Expose the server to the world via `ngrok http 3000`
* Point the twilio webhook to the url that ngrok exposes
* Send an SMS to the number where you setup the webhook
* Watch as a PoachingReport object appears in the database and the "dirty" list of the UI.

## Deployment

Deployment right now is to heroku. You'll need to get setup with their cli tools to manage deployment and ops

You'll need to get the group heroku account setup on your machine. It's likely that you already have your own heroku account, so see http://railsware.com/blog/2013/02/05/how-to-set-up-the-heroku-tools-for-deployment-with-multiple-accounts/ for details about how to manage multiple accounts at once.

Here's the high level details:

* ` heroku plugins:install git://github.com/ddollar/heroku-accounts.git `
* ` heroku accounts:add dev@antipoachingmap.org --auto `
* ` heroku git:remote -a glacial-ocean-2318 `
* ` heroku accounts:set dev@antipoachingmap.org `



We only push the antipoachingbackend folder to remote, so you need to use the following command at root:

` git subtree push --prefix antipoachingbackend heroku master `

## Ops

To view the running logs of the rails server: ` heroku logs --tail --app glacial-ocean-2318 `

To migrate the DB: ` heroku run rake db:migrate --app glacial-ocean-2318 `

To interact directly with the app: ` heroku run rails console --app glacial-ocean-2318 `

To backup the data: `  heroku pg:backups capture --app glacial-ocean-2318 `

To recover the data you'll need a publicly available url. The correct way to do it would be to upload the backup to s3 and then send in the public url from there.
The quick way is to run a local file server and then `ngrok` the port to make it publicly accessible.

* Install: ` npm install -g node-static `
* Run:

* Now install `ngrok`: https://ngrok.com/download
* Run it `ngrok http 8000`

Should look something like this:
```bash
ngrok by @inconshreveable                                                                                                                                         (Ctrl+C to quit)

Tunnel Status                 online
Version                       2.0.19/2.0.19
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://95a74268.ngrok.io -> localhost:8000
Forwarding                    https://95a74268.ngrok.io -> localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       1       0.00    0.00    0.00    0.00

HTTP Requests
-------------

GET /latest.dump               200 OK
GET /                          404 Not Found
GET /favicon.ico               404 Not Found
GET /README.md                 200 OK
```

* Now we can restore our DB! ` heroku pg:backups restore 'http://c03e7d0f.ngrok.io/latest.dump' DATABASE --app glacial-ocean-2318 `

List backups: ` heroku pg:backups --app glacial-ocean-2318 `

Go directory into the postgresql DB: ` heroku pg:psql --app glacial-ocean-2318 `

## Outstanding TODOs:

* Multiple envs