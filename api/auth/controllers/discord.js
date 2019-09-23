const axios = require('axios');
const querystring = require('querystring');

module.exports = {
  getToken: async function (ctx) {
    const { code } = ctx.request.body;
    if (!code) {
      return ctx.response.badRequest('authorization code is missing');
    }

    try {
      const data = {
        client_id: process.env.discord_oauth_client_id,
        client_secret: process.env.discord_oauth_client_secret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: process.env.discord_oauth_redirect_url,
        scope: 'identify',
      };
      console.log(querystring.stringify(data));
      const response = await axios.post(
        'https://discordapp.com/api/oauth2/token',
        querystring.stringify(data)
      ).catch((error) => {
        if (error.response.status === 400) {
          ctx.response.badRequest(error.response.data.error_description);
          return null;
        } else {
          throw error.response.data;
        }
      });

      if (response === null) {
        return;
      }
      ctx.send(response.data);
    } catch (error) {
      ctx.response.badImplementation(error);
    }
  },
  getUserInfo: async function (ctx) {
    const response = await axios.get('https://discordapp.com/api/users/@me', {
      headers: {
        authorization: ctx.request.headers.authorization
      }
    });

    ctx.send(response.data);
  }
};
