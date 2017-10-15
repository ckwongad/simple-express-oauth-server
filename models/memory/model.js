const permAuthCode = {"authorizationCode":"ce215595e87d3418be9e16c8cfac58aa7abbdb73","expiresAt":new Date("2217-10-15T14:14:36.207Z"),"redirectUri":"https://www.google.com","client":{"clientId":"thom","clientSecret":"nightworld","redirectUris":["localhost:3000/","https://www.google.com"],"grants":["authorization_code"]},"user":{"id":"123","username":"thomseddon","password":"nightworld"}}; // added this for testing



/**
 * Constructor.
 */

function InMemoryCache() {
  this.clients = [{ clientId : 'thom', clientSecret : 'nightworld', redirectUris : ['localhost:3000/', 'https://www.google.com'], grants: ['authorization_code'] }];
  this.authCodes = [];
  this.tokens = [];
  this.users = [{ id : '123', username: 'thomseddon', password: 'nightworld' }];
}

/**
 * Dump the cache.
 */

InMemoryCache.prototype.dump = function() {
  console.log('clients', this.clients);
  console.log('tokens', this.tokens);
  console.log('users', this.users);
};

/*
 * Get access token.
 */

InMemoryCache.prototype.getAccessToken = function(bearerToken) {
  var tokens = this.tokens.filter(function(token) {
    return token.accessToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get refresh token.
 */

InMemoryCache.prototype.getRefreshToken = function(bearerToken) {
  var tokens = this.tokens.filter(function(token) {
    return token.refreshToken === bearerToken;
  });

  return tokens.length ? tokens[0] : false;
};

/**
 * Get client.
 */

InMemoryCache.prototype.getClient = function(clientId, clientSecret) {
  var clients = this.clients.filter(function(client) {
    return client.clientId === clientId && (!clientSecret || client.clientSecret === clientSecret);
  });

  return clients.length ? clients[0] : false;
};

/**
 * Save token.
 */

InMemoryCache.prototype.saveToken = function(token, client, user) {
  this.tokens.push({
    accessToken: token.accessToken,
    accessTokenExpiresAt: token.accessTokenExpiresAt,
    clientId: client.clientId,
    refreshToken: token.refreshToken,
    refreshTokenExpiresAt: token.refreshTokenExpiresAt,
    userId: user.id
  });
};

/*
 * Get user.
 */

InMemoryCache.prototype.getUser = function(username, password) {
  var users = this.users.filter(function(user) {
    return user.username === username && user.password === password;
  });

  return users.length ? users[0] : false;
};

/*
 * Save authorization code.
 */

InMemoryCache.prototype.saveAuthorizationCode = function(code, client, user) {
  this.authCodes.push({
    ...code,
    client,
    user
  });

  return { ...code, client, user };
};

/*
 * Get authorization code.
 */

InMemoryCache.prototype.getAuthorizationCode = function(code) {
  if (process.env.NODE_ENV !== 'production')
    this.authCodes.push(permAuthCode);

  var codes = this.authCodes.filter(function(authCode) {
    return authCode.authorizationCode === code;
  });

  return codes.length ? codes[0] : false;
};

/*
 * Revoke authorization code.
 */

InMemoryCache.prototype.revokeAuthorizationCode = function(code) {
  var revokedCode = this.authCodes.pop(function(authCode) {
    return authCode.authorizationCode === code;
  });

  return !!revokedCode;
};

/**
 * Export constructor.
 */

module.exports = InMemoryCache;
