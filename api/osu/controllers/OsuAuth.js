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
        grant_type: 'authorization_code',
        client_id: process.env.osu_oauth_client_id,
        client_secret: process.env.osu_oauth_client_secret,
        redirect_uri: process.env.osu_oauth_redirect_url,
        code: code,
      };
      const oauthResponse = await axios.post(
        `${strapi.config.osu_url}/oauth/token`,
        querystring.stringify(data)
      ).catch((error) => {
        if (error.response.status === 400) {
          ctx.response.badRequest(error.response.data.message);
          return null;
        } else {
          throw error.response.data.message;
        }
      });

      if (oauthResponse === null) {
        return;
      }
      ctx.send(oauthResponse.data);
    } catch (error) {
      ctx.response.badImplementation(error);
    }
  },
  getUserInfo: async function (ctx) {
    const response = await axios.get(`${strapi.config.osu_url}/api/v2/me`, {
      headers: {
        authorization: ctx.request.headers.authorization
      }
    });

    ctx.send(response.data);
  }
};
