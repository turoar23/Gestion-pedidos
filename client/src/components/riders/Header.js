import { useState } from 'react';

import ModalActiveOrder from './ModalActiveOrder';

import classes from './Header.module.css';

const Header = props => {
	const [show, setShow] = useState(false);

	const handleShow = () => setShow(true);
	const handleClose = () => setShow(false);

	return (
		<div className={classes.header}>
			<div className={classes.info}>{props.name}</div>
			<div
				className={classes.actions}
				style={{ backgroundColor: 'blue', color: 'white' }}
				onClick={handleShow}
			>
				<i className='fas fa-motorcycle'></i>
			</div>
			<ModalActiveOrder show={show} onClose={handleClose} />
		</div>
	);
};

export default Header;
