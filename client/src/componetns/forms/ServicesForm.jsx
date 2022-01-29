import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import { TransitionsModal, Loading } from '../../componetns';
import { getServices, getPlanDetailsServices } from '../../redux/reducers';
import { servicePlanPriceRequest } from '../../redux/actions';

const ServicesForm = ({
  captionButton,
  align,
  nameForm,
  CustomBtn,
  handleClick,
  idPlan,
  minutes
}) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => getServices(state));
  const { servicesList, servicesChecked } = useSelector((state) => getPlanDetailsServices(state));

  const [listChecked, setListChecked] = React.useState([]);

  const handleChange = (event) => {
    const indexChecked = listChecked.indexOf(event.target.name);
    if (indexChecked >= 0) {
      const checkedArr = [...listChecked];
      checkedArr.splice(indexChecked, 1);
      setListChecked([...checkedArr]);
    } else {
      setListChecked([...listChecked, event.target.name]);
    }
    // setState({
    //   ...state,
    //   [event.target.name]: event.target.checked
    // });
  };

  const handleServiceChecked = () => {
    const priceService = servicesList.filter((item) => {
      const indexChecked = listChecked.indexOf(item._id);

      return indexChecked >= 0;
    });

    dispatch(servicePlanPriceRequest({ list: priceService, idPlan, minutes, servicesChecked }));
    setListChecked([]);
  };

  // useEffect(() => {
  //   console.log('sad');
  // }, []);

  // const handleChangeSelect = (elem) => formik.setFieldValue('hall', elem.target.value);
  if (loading) return <Loading />;

  return (
    servicesList.length > 0 && (
      <TransitionsModal
        captionButton={captionButton}
        nameForm={nameForm}
        align={align}
        CustomBtn={CustomBtn}
        handleClick={handleClick}
        nameClass="plan-form">
        <FormGroup className="form-box">
          <div className="form-box__body">
            <div className="checkbox-text checkbox-text--head">
              <div className="checkbox-text__left"></div>
              <div className="checkbox-text__right">Цена</div>
            </div>
            {servicesList.map((item) => {
              const isChecked = listChecked && listChecked.indexOf(item._id) >= 0 ? true : false;

              return (
                <div key={item._id}>
                  <FormControlLabel
                    className="checkbox-text"
                    control={
                      <Checkbox checked={isChecked} onChange={handleChange} name={item._id} />
                    }
                    label={
                      <span className="checkbox-text__wrap">
                        <span className="checkbox-text__left">{item.name}</span>
                        <span className="checkbox-text__right">
                          {item.priceText} руб. {item.hourly ? '/ ч.' : ''}
                        </span>
                      </span>
                    }
                  />
                </div>
              );
            })}
          </div>

          <div className="form-box__footer  form-box--footer-btn-panels">
            <Button variant="outlined" color="primary" onClick={handleServiceChecked}>
              Добавить
            </Button>
          </div>
        </FormGroup>
      </TransitionsModal>
    )
  );
};

ServicesForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  params: PropTypes.object,
  CustomBtn: PropTypes.func,
  handleClick: PropTypes.func,
  idPlan: PropTypes.string,
  minutes: PropTypes.number
};
ServicesForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  handleClick: null,
  CustomBtn: null,
  params: {},
  idPlan: '',
  minutes: 0
};

export { ServicesForm };
