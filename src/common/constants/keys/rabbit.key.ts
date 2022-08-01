export class RabbitKeys {
  static RMQ_EXCHANGE = 'megiservices_event_bus';
  static RMQ_TRAVEL_AUTH_QUEUE = 'Travel.Authentication.Api';
  static RMQ_WS_TRAVEL_AUTH_QUEUE = 'Ws.Travel.Authentication.Api';
}

export enum RoutingKeys {
  REGISTER_ROUTING_KEY = 'UserSignUpIntegrationEvent',
  SIGNIN_ROUTING_KEY = 'UserSignInIntegrationEvent',
  LS_LOGOUT_ROUTING_KEY = 'UserLogoutIntegrationEvent',
  SIGNIN_ACCEPTED_KEY = 'SignInAcceptedIntegrationEvent',
  LS_SIGNIN_ACCEPTED_KEY = 'UserSignInAcceptedIntegrationEvent',
}
