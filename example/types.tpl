{
  types: [
    { module: 'model/person.js', alias: 'Person' },
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
      ]
    }
  ]
}