import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

import { TransitionsModal } from './';

const validationSchema = yup.object({
  name: yup
    .string('Наименование')
    .min(2, 'Поле должно содержать минимум 2 буквы')
    .required('Наименование для заполнения'),
  square: yup.string('Площадь, м2').required('Площадь обязательна для заполнения'),
  ceilingHeight: yup.string('Высота потолка').required('Высота потолка обязательна для заполнения'),
  priceFrom: yup.string('Цена от руб.').required('Цена обязательна для заполнения'),
  description: yup.string('Описание'),
  order: yup
    .number('Сортировка')
    .required('Сортировка обязательна для заполнения')
    .typeError('Должно быть числом')
});

const HallForm = ({ captionButton, align, nameForm, hall, onClick, Icon }) => {
  const { name, square, ceilingHeight, priceFrom, description, order } = hall;
  const formik = useFormik({
    initialValues: {
      name: name,
      square: square,
      ceilingHeight: ceilingHeight,
      priceFrom: priceFrom,
      description: description,
      order: order
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onClick(values);
    }
  });

  return (
    <TransitionsModal Icon={Icon} captionButton={captionButton} nameForm={nameForm} align={align}>
      <form className="form-box" onSubmit={formik.handleSubmit}>
        <div className="form-box__body">
          <div className="form-box__row">
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Наименование"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="square"
              name="square"
              label="Площадь, м2"
              value={formik.values.square}
              onChange={formik.handleChange}
              error={formik.touched.square && Boolean(formik.errors.square)}
              helperText={formik.touched.square && formik.errors.square}
              className="form-box__field"
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="ceilingHeight"
              name="ceilingHeight"
              label="Высота потолка, м"
              value={formik.values.ceilingHeight}
              onChange={formik.handleChange}
              error={formik.touched.ceilingHeight && Boolean(formik.errors.ceilingHeight)}
              helperText={formik.touched.ceilingHeight && formik.errors.ceilingHeight}
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="priceFrom"
              name="priceFrom"
              label="Цена от руб."
              value={formik.values.priceFrom}
              onChange={formik.handleChange}
              error={formik.touched.priceFrom && Boolean(formik.errors.priceFrom)}
              helperText={formik.touched.priceFrom && formik.errors.priceFrom}
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              multiline
              id="description"
              name="description"
              label="Описание"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </div>
          <div className="form-box__row">
            <TextField
              fullWidth
              id="order"
              name="order"
              label="Сортировка"
              value={formik.values.order}
              onChange={formik.handleChange}
              error={formik.touched.maorderil && Boolean(formik.errors.order)}
              helperText={formik.touched.order && formik.errors.order}
            />
          </div>
        </div>
        <div className="form-box__footer">
          <Button variant="outlined" color="primary" type="submit">
            Сохранить
          </Button>
        </div>
      </form>
    </TransitionsModal>
  );
};

HallForm.propTypes = {
  captionButton: PropTypes.string,
  align: PropTypes.string,
  nameForm: PropTypes.string,
  hall: PropTypes.object,
  onClick: PropTypes.func,
  Icon: PropTypes.object
};
HallForm.defaultProps = {
  captionButton: '',
  align: '',
  nameForm: '',
  hall: {
    name: '',
    square: '',
    ceilingHeight: '',
    priceFrom: '',
    description: '',
    order: 0
  },
  onClick: () => {},
  Icon: null
};

export { HallForm };
