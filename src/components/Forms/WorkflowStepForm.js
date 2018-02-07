import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { Field, reduxForm, formValueSelector } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { withRouter } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import PropTypes from 'prop-types'

class Form extends Component {
  render() {
    const {
      handleSubmit,
      intl,
      initialized
    } = this.props

    return (
      <form onSubmit={handleSubmit} style={{
        height: '100%',
        alignItems: 'strech',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button type='submit' style={{ display: 'none' }} />

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

Form = reduxForm({ form: 'workflow_step' })(Form)
const selector = formValueSelector('workflow_step')

const mapStateToProps = state => {
  const { intl, vehicleTypes, users } = state

  return {
    intl,
    vehicleTypes,
    users,
    photoURL: selector(state, 'photoURL')
  }
}

export default connect(
  mapStateToProps, { setSimpleValue }
)(injectIntl(withRouter(muiThemeable()(Form))))
