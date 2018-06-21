CREATE TABLE users (
  id char(200) SERIAL NOT NULL,
  name char(20) NOT NULL,
  surename char(50) NOT NULL,
  email char(60) UNIQUE NOT NULL,
  password char(30) NOT NULL
);
