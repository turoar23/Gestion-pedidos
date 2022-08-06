const Button = props => {
  return (
    <div
      style={{
        margin: '0.4rem',
        padding: '0.2rem',
        borderRadius: '0.25rem',
        color: 'white',
        backgroundColor: 'var(--main-color)',
      }}
    >
      {props.children}
    </div>
  );
};

export default Button;
