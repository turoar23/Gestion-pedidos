import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

import { getUsers } from '../../lib/api';
import ItemUser from './ItemUser';

const ListUsers = props => {
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

  let listUsers = users.map(user => <ItemUser key={user._id} user={user} />);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>User</th>
          <th>Role</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>{listUsers}</tbody>
    </Table>
  );
};

export default ListUsers;
