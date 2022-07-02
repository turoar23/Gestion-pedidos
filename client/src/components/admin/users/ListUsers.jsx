import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';

import { getUsers, removeUser } from '../../lib/api/users-api';
import ItemUser from './ItemUser';
import ModalUser from './ModalUser';

const ListUsers = props => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUsers()
      .then(result => {
        setUsers(result);
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const handleClose = () => {
    setShowModal(false);
  };
  const handleOpen = () => {
    setShowModal(true);
  };

  const handleAddUserListUsers = user => {
    const listUsers = users;
    listUsers.push(user);
    setUsers(listUsers);
  };
  const handleRemoveUser = async userId =>{
    await removeUser(userId);

    const filteredList = users.filter(user => user._id !== userId);
    setUsers(filteredList);
  }

  const listUsers = users.map(user => <ItemUser key={user._id} user={user} onRemove={handleRemoveUser} />);

  return (
    <>
      <Button onClick={handleOpen}>Nuevo</Button>
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
      <ModalUser show={showModal} onHide={handleClose} onNewUser={handleAddUserListUsers} />
    </>
  );
};

export default ListUsers;
