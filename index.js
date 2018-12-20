module.exports = app => {
  // Your code here
    app.log('Yay, the app was loaded!');

    app.on('issues.opened', async context => {
        const issueComment = context.issue({ body: 'Thanks for opening this issue!' });
        return context.github.issues.createComment(issueComment);
    });
    app.on( [
        'pull_request.opened',
        'pull_request.edited',
        'pull_request.synchronize'
    ], require('./lib/handle-pull-request-change'));


  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
};
