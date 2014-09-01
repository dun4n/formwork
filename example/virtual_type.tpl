{
  types: [
    { module: 'model/person.js', alias: 'Person' },
    { module: 'model/pet.js', alias: 'Dog'},
    { constructor: function(name) { this.name = name; }, alias: 'Fish'},
  ],
  beans: [
    {
      reference: 'dogRef',
      type: 'Dog',
      properties: [
        {
          type: 'String',
          name: 'name',
          value: 'akh'
        }
      ]
    },
    {
      reference: 'fishRef',
      type: 'Fish',
      arguments: [
        {
          type: 'String',
          value: 'bubble'
        }
      ]
    },
    {
      reference: 'dun4n',
      type: 'Person',
      arguments: [
        {
          type: 'String',
          value: 'dun4n'
        }
      ],
      init: {
        name: 'init'
      },
      properties: [
        {
          name: 'pets',
          value: [
            {
              type: 'Reference',
              value: 'fishRef'
            },
            {
              type: 'Reference',
              value: 'dogRef'
            }
          ]
        }
      ]
    }
  ]
}