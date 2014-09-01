{
  types: [
    { module: 'model/person.js', alias: 'Person' }
  ],
  beans: [
    {
      reference: 'petRef',
      constructor: function(name) { this.name = name; },
      properties: [
        {
          name: 'name',
          value: 'ghost'
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
      apply: [
        {
          name: 'addPet',
          arguments: [
            {
              type: 'Reference',
              value: 'petRef'
            }
          ]
        }
      ]
    }
  ]
}