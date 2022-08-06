import { hexToRgbA } from '../lib/utils';

const Step = props => {
  const opacity = props.opacity; //1 or 0.5 or 0
  const mainColor = document.documentElement.style.getPropertyValue('--main-color');
  const backgroundColor = {
    color: mainColor ? hexToRgbA(mainColor, opacity) : 'var(--main-color)',
  };

  return (
    <div
      style={{
        border: '0.5px solid black',
        flex: '1',
        height: '1.35rem',
        borderRadius: '5px',
        backgroundColor: backgroundColor.color,
      }}
    ></div>
  );
};

const Steps = props => {
  const step = props.step || 1;
  const total = props.total || 4;
  const steps = [];

  for (var i = 0; i < total; i++) {
    const opacity = i < step ? 1 : i === step ? 0.5 : 0;
    steps.push(<Step key={i} opacity={opacity} />);
  }
  return (
    <div
      style={{
        display: 'inline-flex',
        width: '100%',
        padding: '0 2rem',
        margin: '0.5rem 0',
        gap: '4px',
      }}
    >
      {steps}
    </div>
  );
};

export default Steps;
