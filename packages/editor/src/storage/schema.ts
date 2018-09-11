import { schema } from 'normalizr';

export const user = new schema.Entity('users');

export const file = new schema.Entity('files');

export const solution = new schema.Entity('solutions', {
  author: user,
  files: [file],
});
