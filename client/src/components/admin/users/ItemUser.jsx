const ItemUser = props => {
  const user = props.user;

  const handleRemove = () =>{
    props.onRemove(user._id);
  }

  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td>
        <i className='fa fa-trash' aria-hidden='true' onClick={handleRemove}></i>
      </td>
    </tr>
  );
};

export default ItemUser;
