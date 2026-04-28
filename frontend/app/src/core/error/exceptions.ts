export class ServerException extends Error {
  constructor(public message: string = 'Server error occurred', public statusCode?: number) {
    super(message);
    this.name = 'ServerException';
  }
}

export class CacheException extends Error {
  constructor(public message: string = 'Cache error occurred') {
    super(message);
    this.name = 'CacheException';
  }
}

export class AuthException extends Error {
  constructor(public message: string = 'Authentication failed') {
    super(message);
    this.name = 'AuthException';
  }
}

export class NetworkException extends Error {
  constructor(public message: string = 'Network disconnected') {
    super(message);
    this.name = 'NetworkException';
  }
}
