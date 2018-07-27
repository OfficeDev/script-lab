export default {
  id: '123456789',
  name: 'Solution Name',
  author: {
    id: 'AUTHOR_ID',
    name: 'Nico Bellante',
  },
  dateCreated: 123,
  dateLastModified: 456,
  files: [
    {
      id: '123',
      name: 'index.ts',
      language: 'typescript',
      dateLastModified: 789,
      content: '// hello world',
    },
    {
      id: '456',
      name: 'index.html',
      language: 'html',
      dateLastModified: 987,
      content: '<div>hello world</div>',
    },
  ],
}
