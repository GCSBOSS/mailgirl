# [MailGirl](https://gitlab.com/GCSBOSS/mailgirl)

A RESTful service for sending templated e-mails upon request

## Get Started

1. Install with: `npm i -g --no-optional mailgirl`.
2. Point `MAILGIRL_CONF` env var to a TOML [config file](#configuration).
3. Drop your [EJS templates](https://ejs.co) in a folder.
4. Write your [SMTP settings](#available-settings) in the config file from previous step.
5. Run in the terminal with: `mailgirl`.

## Get Started with Docker

The official image repository in Docker Hub is `gcsboss/mailgirl`.

Run like this: `docker run -p 10080:80 -v /your/conf.toml:/usr/src/app/conf.toml -v /your/templates:/usr/src/app/templates gcsboss/mailgirl`

## Available Settings

```toml
templatesDir = './templates'

port = 80

[log]
level = 'info'
file = './maigirl.log'

[smtp]
host = 'smtp.gmail.com'
port = 587
secure = true

[smtp.auth]
user = 'me@gmail.com'
pass = 'my-example-password'
```

## API Usage
- `POST /preview/:template-path`: Responds with the raw e-mail that would be sent.
- `POST /mail/:template-path`: Actually sends the e-mail to the setup SMPT server.

The request body needs to be a JSON whose keys will be available for the given template to work with.

## Templates Definition

The EJS e-mail templates must consist of the following parts:
- *First line*: Subject
- *Second line*: From (allow quoted naming)
- *Third line*: To (allow comma separated lists)
- *Rest of the lines*: The atcual e-mail body

## Reporting Bugs
If you have found any problems with this module, please:

1. [Open an issue](https://gitlab.com/GCSBOSS/mailgirl/issues/new).
2. Describe what happened and how.
3. Also in the issue text, reference the label `~bug`.

We will make sure to take a look when time allows us.

## Proposing Features
If you wish to get that awesome feature or have some advice for us, please:
1. [Open an issue](https://gitlab.com/GCSBOSS/mailgirl/issues/new).
2. Describe your ideas.
3. Also in the issue text, reference the label `~proposal`.

## Contributing
If you have spotted any enhancements to be made and is willing to get your hands
dirty about it, fork us and
[submit your merge request](https://gitlab.com/GCSBOSS/mailgirl/merge_requests/new)
so we can collaborate effectively.
