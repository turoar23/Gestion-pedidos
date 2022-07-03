const ItemUser = props => {
  const user = props.user;

  const handleRemove = () => {
    props.onRemove(user._id);
  };

  const handleEdit = () => {
    props.onEdit(user);
  };

  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <i className='far fa-edit' aria-hidden='true' onClick={handleEdit}></i>
        <i className='fas fa-trash-alt' aria-hidden='true' onClick={handleRemove}></i>
      </td>
    </tr>
  );
};

export default ItemUser;
