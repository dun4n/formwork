{
  dependencies: {
    restify: "~2.8.x"
  },
  on: {
    dependency: function(name) {
      console.log('loaded ' + name + ' from ' + require.resolve(name));
    }
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