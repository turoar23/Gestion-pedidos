import { useEffect } from 'react';
import { useState } from 'react';
import RequireRole from '../auth/RequireRole';

import { getUsers } from '../lib/api';

const UserPage = props => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers()
      .then(result => {
        setUsers(result);
      })
      .catch(err => {
        console.error(err);
      });
    // const users = fetchData();
  }, []);

  let listUsers = users.map(user => <div key={user._id}>{user.email} - {user.role}</div>);

  return <RequireRole role={'Admin'}>{listUsers}</RequireRole>;
};

export default UserPage;
