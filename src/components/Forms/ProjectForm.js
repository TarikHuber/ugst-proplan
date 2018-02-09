import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { ImageCropDialog } from '../../containers/ImageCropDialog'
import { withRouter } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import PropTypes from 'prop-types'
import { AvatarImageField } from '../ReduxFormFields'

class Form extends Component {
  render () {
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
            path={'projects'}
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

Form = reduxForm({ form: 'project' })(Form)
const selector = formValueSelector('project')

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
