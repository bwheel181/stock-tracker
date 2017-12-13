# stock-tracker

This is a simple Node application that uses an external free to use API to track selected stock values in a Mongo DB using React and Express. Quandl is used for the free stock data. The API not perfect I've found and some stock tickers are not available but its good for a free quoter.

![alt text](https://s3-us-west-2.amazonaws.com/bwheel181-s3-misc/Screenshot+2017-12-12+at+5.42.20+PM.png)

  
**Proprietary Tech**
- StockService
- QueryMutator
  
**Third Party Tech**
- Babel
- Webpack
- ESLint
- Bootstrap/React-Bootstrap
- Quandl Free API
- MERN stack

**Major TODOS**
- [ ] Refreshing of stocks over a day old
- [ ] Delete ability
- [ ] Detail view
- [ ] Reports with D3 charting
- [ ] 'Search' functionality to the finder page
- [ ] Filter functionality
- [ ] Session management/User authentication
- [ ] Allow user to customize what stock information fields are available

**Minor TODOS**
- [ ] Clean up and polish code
- [ ] Fix minor bugs
- [ ] Linter run-through
- [ ] Improve stock service
- [ ] Move `StockFinder`
- [x] Mark close with 'green' if above open and 'red' if below open
- [x] Change volume number to 'comma'd' number
