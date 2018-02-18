import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Field, reduxForm, formValueSelector, FieldArray } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { ImageCropDialog } from '../../containers/ImageCropDialog'
import { withRouter } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import PropTypes from 'prop-types'
import { AvatarImageField } from '../ReduxFormFields'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

class Form extends Component {


  renderField = ({ input, label, type, meta: { touched, error } }) => (
    <div>
      <label>{label}</label>
      <div>
        <input {...input} type={type} placeholder={label} />
        {touched && error && <span>{error}</span>}
      </div>
    </div>
  )


  renderSteps = (props) => {
    const { fields } = props
    const { intl } = this.props

    return < List >
      {
        fields.map((step, index) => (
          <ListItem key={index} disabled={true}>

            <div style={{ display: 'flex' }}>
              <IconButton
                label={`Remove step`}
                onClick={() => fields.remove(index)}>
                <FontIcon className="material-icons" >delete</FontIcon>
              </IconButton>
              <br />
              <Field
                name={`${step}.name`}
                component={TextField}
                hintText={intl.formatMessage({ id: 'name_hint' })}
                floatingLabelText={intl.formatMessage({ id: 'name_label' })}
                withRef
              />
              <br />
              <Field
                name={`${step}.description`}
                component={TextField}
                hintText={intl.formatMessage({ id: 'description_hint' })}
                floatingLabelText={intl.formatMessage({ id: 'description_label' })}
                withRef
              />
            </div>


            <FieldArray name={`${step}.steps`} component={this.renderSteps} />

          </ListItem>
        ))
      }

      <IconButton
        label={`Add step`}
        primary={true}
        onClick={() => fields.push({})}>
        <FontIcon className="material-icons" >add</FontIcon>
      </IconButton>
    </List >
  }


  render() {
    const {
      handleSubmit,
      intl,
      initialized,
      setSimpleValue,
      new_company_photo,
      match,
      handlePhotoUploadSuccess
    } = this.props

    const uid = match.params.uid

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type='submit' style={{ display: 'none' }} />

        <div style={{ marginLeft: -10 }}>
          <AvatarImageField
            uid={uid}
            change={this.props.change}
            initialized={initialized}
            intl={intl}
            path={'workflows'}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div>
            <Field
              name='name'
              disabled={!initialized}
              component={TextField}
              hintText={intl.formatMessage({ id: 'name_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'name_label' })}
              ref='name'
              withRef
            />
          </div>
          <div>
            <Field
              name='description'
              disabled={!initialized}
              component={TextField}
              multiLine
              rows={2}
              hintText={intl.formatMessage({ id: 'description_hint' })}
              floatingLabelText={intl.formatMessage({ id: 'description_label' })}
              ref='description'
              withRef
            />
          </div>
          <div>
            <Subheader >Steps</Subheader>
            <FieldArray name="steps" component={this.renderSteps} />
          </div>
        </div>
        <span style={{ width: 50, display: 'inline-block' }} />

        <ImageCropDialog
          path={`companies/${uid}`}
          fileName={`photoURL`}
          onUploadSuccess={(s) => { handlePhotoUploadSuccess(s) }}
          open={new_company_photo !== undefined}
          src={new_company_photo}
          handleClose={() => { setSimpleValue('new_company_photo', undefined) }}
          title={intl.formatMessage({ id: 'change_photo' })}
        />
      </form>
    )
  }
}

Form.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  intl: intlShape.isRequired,
  initialized: PropTypes.bool.isRequired,
  setSimpleValue: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired
}

Form = reduxForm({ form: 'workflow' })(Form)
const selector = formValueSelector('workflow')

const mapStateToProps = state => {
  const { intl, vehicleTypes, users, simpleValues } = state

  const new_company_photo = simpleValues.new_company_photo

  return {
    intl,
    vehicleTypes,
    users,
    new_company_photo,
    photoURL: selector(state, 'photoURL')
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withRouter(muiThemeable()(Form))))
