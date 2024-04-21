export interface User {
  user: {
    _id?: String;
    email?: String;
    password?: String;
    isVerified: String;
    firstName: String;
    lastName: String;
    googleId: String;
    accountType: String;
  };
}
