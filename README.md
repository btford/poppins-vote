# poppins-vote

A [Mary Poppins](https://github.com/btford/mary-poppins) plugin for calculating upvotes.

It does this "check" by seeing if the user submitting the PR has contributed before.

## Install

`npm install poppins-vote`


## Configure

To use this plugin, you need to load it in your config file with `couldYouPlease`:


```javascript
// config.js
module.exports = function (poppins) {

  poppins.config = { /*...*/ };

  // pr checklist config
  poppins.couldYouPlease('poppins-vote');
};
```

## Usage



## License
MIT
