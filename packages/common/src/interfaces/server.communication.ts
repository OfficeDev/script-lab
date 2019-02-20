interface IServerAuthRequest {
  code: string;
  state: string;
}

interface IServerAuthResponse {
  access_token?: string;
  error?: string;
}
