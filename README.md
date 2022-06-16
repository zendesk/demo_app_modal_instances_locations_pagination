# Demo communicating between locations and pagination through API results

This demo app shows:  
* Setting up events on locations that use autoLoad:false
* Sending events from one location to another
* Preloading the top_bar location from the background location using invoke('preloadPane')
* Sending data from a modal to the ticket sidebar location
* Retrieving larger data sets from the REST API using pagination

## Getting started

Follow these steps to get a local copy up and running.

### Prerequisites

- Zendesk Command Line (ZCLI)

[Using Zendesk Command Line](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/#installing-and-updating-zcli)

### Installation

1. Clone the repo

    ``` bash
    git clone https://github.com/example.git
    ```

2. Run the app.

    ``` bash
    zcli apps:server
    ```

[Testing your Zendesk app locally](https://developer.zendesk.com/documentation/apps/app-developer-guide/zcli/#testing-your-zendesk-app-locally)

<!-- Links to relevant resources such as help center articles or dev docs -->

## Additional Resources

- [Zendesk Apps Guide](https://developer.zendesk.com/documentation/apps/)
- [Apps Support API documentation](https://developer.zendesk.com/api-reference/apps/apps-support-api/introduction/)
- Inspiration from [Apps framework v2 Instances demo app](https://github.com/zendesk/demo_apps/tree/master/v2/support/instances_sample_app)

<!-- Issue reporting with link to repo issues page -->

## Issues

You can [create an issue on Github](https://github.com/zendesk/example/issues/new),
reach out in our [Developer Community](https://support.zendesk.com/hc/en-us/community/topics),
or report the issue in the [Zendesk Developers Slack group](https://docs.google.com/forms/d/e/1FAIpQLScm_rDLWwzWnq6PpYWFOR_PwMaSBcaFft-1pYornQtBGAaiJA/viewform).
