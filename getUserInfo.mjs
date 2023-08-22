import https from 'https';
import fs from 'fs';
import { HOST, PARTNER_TOKEN, LOGIN, PASSWORD } from './constants.mjs';

let user = {};

let headers = {
  Accept: 'application/vnd.yclients.v2+json',
  'Content-Type': 'application/json',
  Authorization: `${PARTNER_TOKEN}`,
};

const options = {
  method: 'POST',
  hostname: HOST,
  path: '/api/v1/auth',
  headers: headers,
};

const postData = JSON.stringify({
  login: LOGIN,
  password: PASSWORD,
});

export const getUserInfo = () => {
  let req = https.request(options, function (res) {
    let chunks = [];

    res.on('data', function (chunk) {
      chunks.push(chunk);
    });

    res.on('end', function (chunk) {
      let body = Buffer.concat(chunks);
      let jsonBody = JSON.parse(body.toString());
      user.id = jsonBody.data.id;
      user.name = jsonBody.data.name;
      user.phone = jsonBody.data.phone;
      user.token = jsonBody.data.user_token;
      fs.writeFileSync('user.json', JSON.stringify(user));
    });

    res.on('error', function (error) {
      console.error(error);
    });
  });

  req.write(postData);

  req.end();
};
