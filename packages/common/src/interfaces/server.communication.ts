export interface IServerAuthRequest {
  code: string;
  state: string;
}

export interface IServerAuthResponse {
  access_token?: string;
  error?: string;
}
