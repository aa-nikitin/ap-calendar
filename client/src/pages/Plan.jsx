import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { PlanHalls, PlanDetails } from '../componetns';
import { getWorkShedule, getPlanDetails } from '../redux/reducers';

const Plan = () => {
  const [valueDate, setValueDate] = React.useState(new Date());
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { isVisible: isVisiblePlanDetails } = useSelector((state) => getPlanDetails(state));
  const { list: hoursArray } = workShedule;

  // useEffect(() => {
  //   dispatch(planHallsRequest(thisDate));
  // }, [dispatch, thisDate]);

  if (isVisiblePlanDetails) return <PlanDetails isSeparatePage={true} />;

  return (
    <>
      <div className="content-page">
        <h1 className="content-page__title">Планирование</h1>

        {hoursArray ? (
          <PlanHalls valueDate={valueDate} setValueDate={setValueDate} />
        ) : (
          <>
            Для того что бы начать работу с данным разделом задайте параметры расписания в{' '}
            <NavLink className="link" to="/settings">
              настройках
            </NavLink>
          </>
        )}
      </div>
    </>
  );
};

export { Plan };
