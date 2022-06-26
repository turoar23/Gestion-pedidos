const ItemUser = props => {
  const user = props.user;

  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.role}</td>
      <td></td>
    </tr>
  );
};

export default ItemUser;
