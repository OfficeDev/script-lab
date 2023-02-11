const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_REDIRECT_URL } = process.env;
const GENERIC_ERROR_STRING = 'An unexpected login error has occurred.';

export interface GithubApiAccessTokenResponse {
  access_token: string;
  error: string;
  error_description: string;
}

const https = require('https');

async function github_auth_post(code: string, state: string) {
  // https://github.com/login/oauth/access_token

  const options = {
    host: 'github.com',
    method: "POST",
    path: "/login/oauth/access_token",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }

  const post_data = {
    client_id: GITHUB_CLIENT_ID,
    client_secret: GITHUB_CLIENT_SECRET,
    redirect_uri: GITHUB_REDIRECT_URL,
    code,
    state,
  };
  const data = JSON.stringify(post_data);


  // Good to know what is actually being sent
  // console.log(options)
  // console.log(data)

  return new Promise<{ status: number; buffer: () => Promise<string> }>(
    (resolve, reject) => {


      const request = https.request(options, (response: any) => {
        const statusCode = response.statusCode;
        response.setEncoding('utf8');

        response.on("error", (err: any) => {
          reject(err);
        });

        // collect the data
        let data = '';

        response.on('data', (chunk: string) => {
          data += chunk;
        });

        const dataBuffer = new Promise<string>((resolveBuffer) => {
          response.on("end", () => {
            resolveBuffer(data);
          });
        });

        resolve({
          status: statusCode || -1,
          buffer: () => dataBuffer,
        });
      });

      request.on('error', (e: any) => {
        //console.log("Error : " + e.message);
        reject(e)
      });

      request.write(data);
      request.end();
    }
  );
}

function getResultObjectBasedOnAuthResponse(
  body: GithubApiAccessTokenResponse,
): IServerAuthResponse {
  if (body.error) {
    return { error: body.error + ': ' + body.error_description };
  } else if (body.access_token) {
    return { access_token: body.access_token };
  } else {
    return { error: GENERIC_ERROR_STRING };
  }
}

export async function getAccessTokenOrErrorResponse(
  input: IServerAuthRequest,
): Promise<IServerAuthResponse> {
  console.log("post");

  const { status, buffer } = await github_auth_post(input.code, input.state);
  // console.log(status)
  if (status !== 200) {
    return { error: GENERIC_ERROR_STRING };
  }

  const response = await buffer();
  // console.log(response);
  const data = JSON.parse(response) as GithubApiAccessTokenResponse;
  const result = getResultObjectBasedOnAuthResponse(data);
  return result;
}