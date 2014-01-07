
var fs = require('fs');

module.exports = function (poppins) {
  var plugins = poppins.plugins,
      server = poppins.server;

  plugins.vote = {
    token: '+1',

    criteria: function (issue) {
      return issue.body.indexOf(plugins.vote.token) > 0;
    },

    calculateVote: function (issue) {
      var voteComments = issue.comments.filter(plugins.vote.criteria);

      var uniqueCommentAuthors = voteComments.reduce(function (list, comment) {
        var author = comment.user.login;
        if (list.indexOf(author) === -1) {
          list.push(author);
        }
        return list;
      }, []);

      return uniqueCommentAuthors.length;
    },

    renderPage: function (req, res) {
      var links;
      if (poppins.issues) {
        var filteredIssues = poppins.issues.filter(function (issue) {
          return issue.vote >= 0;
        });

        var sortedIssues = filteredIssues.sort(function (a, b) {
          return a.vote > b.vote ? -1 : a.vote < b.vote ? 1 : 0;
        });
        links = sortedIssues.map(plugins.vote.linkifyIssue);
      } else {
        links = [];
      }
      res.send(plugins.vote.header +
        links.length > 0 ? links.join('\n') : 'There are no issues with votes' +
        plugins.vote.footer);
    },

    linkifyIssue: function (issue) {
      return '<a href="https://github.com/' +
              poppins.config.user + '/' +
              poppins.config.user + '/issues/' +
              issue.number + '">#' +
              issue.number + ' ' +
              issue.title + '</a>';

    },

    header: fs.readFileSync(__dirname + '/templates/header.html', 'utf8'),

    footer: fs.readFileSync(__dirname + '/templates/footer.html', 'utf8')
  };


  function calculateVote (issue) {
    issue.vote = plugins.vote.calculateVote(issue);
  }

  poppins.on('issueCommentCreated', calculateVote);
  poppins.on('pullRequestCommentCreated', calculateVote);

  poppins.on('cacheBuilt', function () {
    poppins.issues.forEach(calculateVote);
  });

  server.get('/', plugins.vote.renderPage);
};
