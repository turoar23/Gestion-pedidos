import React, { useState, Fragment, useRef } from 'react';
import { Row, Col, Form } from 'react-bootstrap';

import ModalOrder from '../../orders/ModalOrder';
import { getTimeFromOrder, differentTwoDate, formatTime } from '../../../lib/utils';
import useHttp from '../../../hooks/use-http';
import { updateOrder } from '../../../lib/api';
import { getUser } from '../../../lib/jwt';

// Component
const ResumenOrder = props => {
  const user = getUser();
  const [showOrderInfo, setShowOrderInfo] = useState(false);
  const { sendRequest, status } = useHttp(updateOrder);

  const switchRef = useRef();

  const handleCloseOrderInfo = () => setShowOrderInfo(false);
  const handleShowOrderInfo = () => setShowOrderInfo(true);

  const handleToggleUpdated = async () => {
    await sendRequest({
      ...props.order,
      statusCorrect: switchRef.current.checked,
    });
  };

  const accepted_at = getTimeFromOrder(props.order.times, 'accepted_at');
  const delivering = getTimeFromOrder(props.order.times, 'Start delivering');
  const arrived = getTimeFromOrder(props.order.times, 'Arrived destination');
  const completed = getTimeFromOrder(props.order.times, 'Completed');
  const fulfill_at = getTimeFromOrder(props.order.times, 'fulfill_at');
  const success = differentTwoDate(completed, fulfill_at);

  const successColor =
    typeof success === 'number'
      ? success > 0
        ? 'green'
        : success > -15 && props.order.for_later
        ? 'orange'
        : 'red'
      : 'black';

  return (
    <Fragment>
      <Row className="order">
        <Col>{props.order.gloriaId || '--'}</Col>
        <Col>{`${props.order.address.street} ${props.order.address.zipcode}`}</Col>
        <Col>{props.order.restaurant}</Col>
        <Col>{props.order.rider ? props.order.rider.name : '--'}</Col>
        <Col>
          <div>{formatTime(accepted_at)}</div>
          <div>{differentTwoDate(accepted_at, fulfill_at)}</div>
        </Col>
        <Col>
          <div>{formatTime(delivering)}</div>
          <div>{differentTwoDate(accepted_at, delivering)}</div>
        </Col>
        <Col>
          <div>{formatTime(arrived)}</div>
          <div>{differentTwoDate(delivering, arrived)}</div>
        </Col>
        <Col>
          <div>{formatTime(completed)}</div>
          <div>{differentTwoDate(arrived, completed)}</div>
        </Col>
        <Col>
          <div>
            {formatTime(fulfill_at)}
            {props.order.for_later === true && <sup className="for-later">P</sup>}
          </div>
          <div>
            <span style={{ color: successColor }}>{success}</span> / {differentTwoDate(accepted_at, completed)}
          </div>
        </Col>
        {user.role === 'Admin' && (
          <Col>
            <Form.Switch
              type="switch"
              defaultChecked={props.order.statusCorrect}
              ref={switchRef}
              onClick={handleToggleUpdated}
            />
          </Col>
        )}
        <Col xs={1}>
          <i className="fas fa-info" onClick={handleShowOrderInfo}></i>
        </Col>
      </Row>
      <ModalOrder show={showOrderInfo} handleClose={handleCloseOrderInfo} order={props.order} edit={false} />
    </Fragment>
  );
};
export default ResumenOrder;
