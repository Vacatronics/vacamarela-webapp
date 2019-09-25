const getCredentials = (user) => {
  let newUser = {...user};
  if (!user) {
    newUser = JSON.parse(sessionStorage.getItem('sensevone.user'));
  }

  return {
    headers: {
      //'Authorization': `${newUser.token}`,
      'Content-Type': 'application/json'
    },
    auth: {
      username: `${newUser.token}`,
      password: 'x'
    }
  }
}

const getId = () => {
  const user = JSON.parse(sessionStorage.getItem('sensevone.user'));
  return user._id;
}

const isUser = () => {
  const user = JSON.parse(sessionStorage.getItem('sensevone.user'));
  return user.role === 'user';
}

export {
  getCredentials,
  getId,
  isUser
};