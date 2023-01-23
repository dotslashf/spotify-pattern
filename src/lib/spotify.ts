export default class Spotify {
  clientId: string | undefined;
  clientSecret: string | undefined;
  bearerToken: string;
  API_ENDPOINT: string;
  TOKEN_ENDPOINT: string;
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.bearerToken = Buffer.from(
      `${this.clientId}:${this.clientSecret}`
    ).toString("base64");
    this.API_ENDPOINT = "https://api.spotify.com/v1";
    this.TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
  }

  async getAccessToken(refreshToken: string) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const headers = {
      Authorization: `Basic ${this.bearerToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const res = await fetch(this.TOKEN_ENDPOINT, {
      method: "POST",
      headers,
      body,
    });
    return await res.json();
  }

  async getUsersTopTracks(refreshToken: string) {
    const { access_token: accessToken } = await this.getAccessToken(
      refreshToken
    );
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await fetch(
      `${this.API_ENDPOINT}/me/top/tracks?time_range=medium_term&limit=50&offset=0`,
      {
        headers,
      }
    );
    return await res.json();
  }

  async getUsersPlaylists(refreshToken: string) {
    const { access_token: accessToken } = await this.getAccessToken(
      refreshToken
    );
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };
    const res = await fetch(`${this.API_ENDPOINT}/me/playlists`, {
      headers,
    });
    return await res.json();
  }
}
