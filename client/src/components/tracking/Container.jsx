import Steps from '../UI/Steps';

const Container = props => {
  const status = props.status.toLocaleLowerCase();
  let statusText = '';
  let step = 1;

  switch (status) {
    case 'active':
      statusText = 'Recibido';
      step = 1;
      break;
    case 'delivering':
      statusText = 'Repartiendo';
      step = 2;
      break;
    case 'arrived':
      statusText = 'Llegando';
      step = 3;
      break;
    default:
      statusText = 'Completado';
      step = 4;
  }

  return (
    <div style={{ height: '300px', position: 'relative', padding: '10px 0px' }}>
      <div>
        <img src={`/img/${status}.svg`} alt={`${status} svg`} />
      </div>
      <div>
          <Steps step={step} />
        {/* <div>
          <img src={`/img/steps-${status}.svg`} alt='progress' />
        </div> */}
        <div>
          <i>{statusText}</i>
        </div>
      </div>
    </div>
  );
};

export default Container;
