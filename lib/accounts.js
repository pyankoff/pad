AccountsTemplates.configure({
  defaultLayout: 'defaultLayout',
  defaultContentRegion: 'main',
  // Behaviour
  confirmPassword: false,
  enablePasswordChange: true,
  forbidClientAccountCreation: false,
  overrideLoginErrors: true,
  sendVerificationEmail: false,

  // Appearance
  showAddRemoveServices: false,
  showForgotPasswordLink: true,
  showLabels: false,
  showPlaceholders: true,
  hideSignInLink: false,

  // Client-side Validation
  continuousValidation: false,
  negativeFeedback: false,
  negativeValidation: true,
  positiveValidation: true,
  positiveFeedback: true,
  showValidating: true,

  // Redirects
  homeRoutePath: '/home',
  redirectTimeout: 1000,

  // Button
  texts: {
    button: {
      signUp: 'Sign Up'
    }
  }
});

AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');
AccountsTemplates.configureRoute('forgotPwd');
AccountsTemplates.configureRoute('resetPwd');
