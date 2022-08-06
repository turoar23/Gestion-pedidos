import { useEffect } from 'react';
import { Table } from 'react-bootstrap';

import useHttp from '../../hooks/use-http';
import { getReviews } from '../../lib/api';

const PanelReviews = () => {
  const { sendRequest, status, data } = useHttp(getReviews);

  useEffect(() => {
    sendRequest();
  }, []);

  let reviews = <div>No se han encontrado reseñas</div>;

  if (data) {
    let titles = data[0];
    data.shift();
    let transformedData = data.reverse();
    reviews = (
      <Table striped bordered hover>
        <thead>
          <tr>
            {titles.map(col => (
              <th>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transformedData.map(row => (
            <tr>
              {row.map(col => (
                <td>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  return (
    <div>
      <h1>Reseñas</h1>
      <p>
        Estas reseñas se rellenan desde un Google Form que se les envia al cliente. De momento solo
        estan de Umbrella
      </p>
      {reviews}
    </div>
  );
};

export default PanelReviews;
