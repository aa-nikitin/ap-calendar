import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { PlanDetails } from '../componetns';
import { getPlanDetailsRequest } from '../redux/actions';
import { getPlanDetails } from '../redux/reducers';

const DetailPlan = ({ match }) => {
  const dispatch = useDispatch();

  const { isVisible: isVisiblePlanDetails } = useSelector((state) => getPlanDetails(state));
  useEffect(() => {
    dispatch(getPlanDetailsRequest(match.params.id));
  }, [dispatch, match.params.id]);

  if (isVisiblePlanDetails) return <PlanDetails />;
  return <>что то пошло не так</>;
};

export { DetailPlan };
