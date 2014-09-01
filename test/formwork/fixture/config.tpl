{
  types: [
    { module: './fishfactory.js', constructor: 'create', alias: 'Fish' },
    { module: './pet.js', alias: 'Dog' },
    { constructor: function(name) { this.name = name; }, alias: 'Anonymous'},
    './person.js'
  ],
  beans: [
    {
      reference: 'anonymous_example',
      type: 'Anonymous',
      arguments: 'anonymous name 1'
    },
    {
      reference: 'anonymous',
      constructor: function(name) { this.name = name; },
      arguments: 'anonymous name 2'
    },
    {
      reference: 'configObject',
      value: {
        name: {configObject.name},
        nick: {configObject.nick}
      }
    },
    {
      reference: 'fish_example',
      type: './fishfactory.js',
      constructor: 'create',
      arguments: {fish.arguments.name}
    },
    {
      reference: 'fish',
      type: 'Fish',
      arguments: {fish.arguments.name}
    },
    {
      reference: 'oneDog',
      type: 'Dog',
      arguments: [
        {
          type: 'Reference',
          value: {
            reference: 'dogName',
            value: {dogName}
          }
        }
      ],
      apply: [
        {
          name: 'setType',
          arguments: ['dog']
        }
      ]
    },
    {
      reference: 'person',
      type: './person.js',
      arguments: [
        {
          type: 'String',
          value: {configObject.name}
        },
        {configObject.nick}
      ],
      init: {
        name: 'init',
        arguments: [
          {
            type: 'String',
            value: 'person name from init!'
          }
        ]
      },
      properties: [
        {
          name: 'name',
          type: 'String',
          value: 'person name from set!' 
        }
      ],
      apply: [
        {
          name: 'setName',
          arguments: [
            {
              type: 'String',
              value: 'person name from setName!'
            }
          ]
        },
        {
          name: 'addPet',
          arguments: [
            {
              type: 'Reference',
              value: 'oneDog'
            }
          ]
        }
      ]
    }
  ]
};