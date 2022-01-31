import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { PlanHalls, PlanDetails, PlanMonth } from '../componetns';
import { getWorkShedule, getPlanDetails } from '../redux/reducers';

const Plan = () => {
  const [valueDate, setValueDate] = React.useState(new Date());
  const [typePlan, setTypePlan] = React.useState('halls');
  const workShedule = useSelector((state) => getWorkShedule(state));
  const { isVisible: isVisiblePlanDetails } = useSelector((state) => getPlanDetails(state));
  const { list: hoursArray } = workShedule;

  // useEffect(() => {
  //   dispatch(planHallsRequest(thisDate));
  // }, [dispatch, thisDate]);

  if (isVisiblePlanDetails)
    return <PlanDetails valueDate={valueDate} setValueDate={setValueDate} isSeparatePage={true} />;

  const handleChangeTypePlan = (_event, newTypelan) => {
    if (newTypelan) setTypePlan(newTypelan);
  };

  return (
    <>
      <div className="content-page">
        <div className="content-page__head-row">
          <div className="content-page__head-col">
            <h1 className="content-page__title">Планирование</h1>
          </div>
          <div className="content-page__head-col">
            <ToggleButtonGroup value={typePlan} exclusive={true} onChange={handleChangeTypePlan}>
              <ToggleButton name="halls" value="halls">
                Залы
              </ToggleButton>
              <ToggleButton name="month" value="month">
                Месяц
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </div>
        {hoursArray ? (
          <>
            {typePlan === 'halls' && (
              <PlanHalls valueDate={valueDate} setValueDate={setValueDate} />
            )}
            {typePlan === 'month' && (
              <PlanMonth valueDate={valueDate} setValueDate={setValueDate} />
            )}
          </>
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
