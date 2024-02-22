# Alpha

**Alpha.CA.gov is no longer being updated.**

This was a 12-week pilot project in 2019-20 that explored new approaches for state websites.

If you need the current state homepage, visit [CA.gov](https://www.ca.gov/).

## Fellow Californians,
We're reimagining CA.gov with and for the people of California.

Our first step: Make CA.gov easier for Californians to use. We're working to help you access the services and information you need.

And we invite you to join us.

## Follow our progress
We're sharing our work and insights on our [blog](https://medium.com/cadotgov) and [GitHub](https://github.com/cagov).

## Share your feedback
Please take our [five-minute survey](https://www.surveymonkey.com/r/AlphaCAgov) to help improve CA.gov. Thanks in advance for sharing your thoughts.

We're excited to work with you.

Team Alpha.CA.gov

_Interested in how we got started?_ [Learn more.](https://medium.com/cadotgov/re-imagining-ca-gov-how-can-california-government-better-serve-its-people-c3212f843f1d)


## Building

### Prerequisites

- install <a href="https://nodejs.org">node.js</a>
- run ```npm install```

### Build command

```npm run build```

Concatenates, minifies and removes unused CSS.

### Translations

We are using a google spreadsheet as the datasource for our content strings because it has a cool integrated formula to provide automatic translation values we can use while we wait for our human translators to review. The spreadsheet is at https://docs.google.com/spreadsheets/d/1pjhiNZQtlb1KCrkdMTbYcvzhZkffNQpG5ekpmAU_SkM/edit#gid=0 and is accessible to alpha members. We publish the strings publicly when the spreadsheet is changed. To pull in new translations:

- Add your new strings to the google spreadsheet
- Run the command: ```npm run gimmetranslations``` to pull the latest translation strings into the local file system
- Run the build command to regenerate the site with latest translations: ```npm run build```
- Checkin the updated src/lang-global.csv along with your file updates so the builds run on the server which do not pull latest translation strings will run with latest content.

### Files only in /public

Some static files are only present in the public folder and are set to be ignored by the webpack clean plugin which deletes stuff in there with every build:

- web.config (webserver configuration)
- robots.txt
- sitemap.xml

Concatenates, minifies and removes unused CSS, builds template partials.

### Class event triggers

Please follow the convention of using classnames with a ```js-``` prefix when using a selector in javascript to interact with an element. We should not allow any CSS attributes to be added to the ```js-``` classnames so these will be used only by javascript and can be safely removed if a listener is changed.

