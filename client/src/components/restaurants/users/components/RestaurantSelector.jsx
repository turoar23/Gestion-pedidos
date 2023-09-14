import React, { useRef, useState } from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

const RestaurantSelector = props => {
  const [itemsSelected, setItemsSelected] = useState(props.itemsSelected || []);
  const itemsParsed = (props.items || []).map(item => ({ _id: item._id, name: item.name, permission: 'read' }));
  const items = itemsParsed.filter(item => !itemsSelected.find(itemSelected => itemSelected._id === item._id)) || [];

  const handleSelectedOption = itemId => {
    const itemSelected = items.find(item => item._id === itemId);

    if (!itemSelected) throw new Error('Cant find the option');

    const newItemsSelected = [...itemsSelected, itemSelected];

    setItemsSelected(newItemsSelected);
    props.onUpdateList([...newItemsSelected]);
  };

  const handleRemoveOption = itemId => {
    const itemSelectedIndex = itemsSelected.findIndex(item => item._id === itemId);

    if (itemSelectedIndex === -1) throw new Error('Cant find the option');

    itemsSelected.splice(itemSelectedIndex, 1);

    setItemsSelected([...itemsSelected]);
    props.onUpdateList([...itemsSelected]);
  };

  const handlePermissionChange = (itemId, permissionType) => {
    const itemSelectedIndex = itemsSelected.findIndex(item => item._id === itemId);

    if (itemSelectedIndex === -1) throw new Error('Cant find the option');

    itemsSelected[itemSelectedIndex].permission = permissionType;

    setItemsSelected([...itemsSelected]);
    props.onUpdateList([...itemsSelected]);
  };

  return (
    <>
      <DropdownButton title="Selecciona Restaurante">
        {items.map(item => (
          <Dropdown.Item key={item._id} onClick={() => handleSelectedOption(item._id)}>
            {item.name}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      {itemsSelected.map(item => (
        <SelectedItem
          key={item._id}
          item={item}
          onRemove={() => handleRemoveOption(item._id)}
          onChangePermission={handlePermissionChange}
        />
      ))}
    </>
  );
};

const SelectedItem = props => {
  const item = props.item;
  const readRef = useRef();
  const isRead = item.permission !== 'all';

  const handleRemove = () => {
    props.onRemove(item._id);
  };

  const handlePermissionsChange = () => {
    const typePermission = readRef.current.checked ? 'read' : 'all';

    props.onChangePermission(item._id, typePermission);
  };

  return (
    <div className="d-flex justify-content-between mt-2 mb-2">
      {item.name}
      <div key={`inline-radio`}>
        <Form.Check
          name={`selectedItems-${item._id}`}
          inline
          label="Lectura"
          type={'radio'}
          id={`${item._id}-inline-radio-1`}
          defaultChecked={isRead}
          ref={readRef}
          onChange={handlePermissionsChange}
        />
        <Form.Check
          name={`selectedItems-${item._id}`}
          inline
          label="Todo"
          type={'radio'}
          id={`${item._id}-inline-radio-2`}
          defaultChecked={!isRead}
          onChange={handlePermissionsChange}
        />
      </div>
      <span onClick={handleRemove}>X</span>
    </div>
  );
};

export default RestaurantSelector;
