# Neighborhood Map + Event Finder
This neighborhood map is a single page web application that is intended to enhance user experience of nearby event searching. Currently, this web app contains information retrieved from TicketMaster API based on personal location information.  
If you are interested, there's a demo version hosted on github pages, [neighborhood-map](https://cielong.github.io/knockout-neighborhood-map/)
### Functionality
This web app provides 2 main functionality:  
1. Access real events data near current location through TicketMaster API
2. Filter events both by input prefix or select categories
  
## Implementation Intro
This web app is implemented using knockoutJS MVVM framework, with integration of Google Maps API and TicketMaster API.

## Setting up
### Download/Clone this repo to your local computer
> git clone git@github.com:cielong/knockout-neighborhood-map

And then, change directory to the cloned repo.

### Run the web app
open your browser (Chrome, Firefox), and open the index.html under the directory.

## TODO
There are still a lot haven't been done:  
- [ ] Enable aside bar toggle.
- [ ] Create a dataModel to better separate data source and viewModel.  
- [ ] Enable scroll event of the aside bar to get more event data. 
- [ ] Enable interested fields/locations configuration and keywords search 