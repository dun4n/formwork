{
  types: [
    { module: 'model/person.js', alias: 'Person' },
    { module: 'model/pet.js', alias: 'Pet' }
  ],
  beans: [
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
              value: {
                reference: 'petRef',
                type: 'Pet',
                properties: [
                  {
                    name: 'name',
                    type: 'String',
                    value: 'akh'
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}