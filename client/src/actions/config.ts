import { createAction } from 'typesafe-actions'

export const changeHost = createAction('CHANGE_HOST', resolve => {
  return (host: string) => resolve(host)
})
