{
  dependencies: {
    restify: "~2.8.x"
  },
  types: [
    {
      constructor: function(name) {
        var Restify = require('restify');
        return Restify.createServer({name: name});
      },
      alias: 'RestHandler'
    }
  ],
  beans: [
    {
      reference: 'restHandler',
      type: 'RestHandler',
      arguments: ['myRestHandler'],
      apply: [
        {
          name: 'listen',
          arguments: [8080]
        }
      ]
    }
  ]
}