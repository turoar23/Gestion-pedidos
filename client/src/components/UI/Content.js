import classes from './Content.module.css';

const Content = props => {
	return (
		<section
			className={`${classes.content} ${
				props.className ? props.className : ''
			}`}
		>
			{props.children}
		</section>
	);
};

export default Content;
