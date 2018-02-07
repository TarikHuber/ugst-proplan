import WorkflowStepForm from '../../components/Forms/WorkflowStepForm'
import Dialog from 'material-ui/Dialog'
import FireForm from 'fireform';
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import isGranted from 'rmw-shell/lib/utils/auth'
import muiThemeable from 'material-ui/styles/muiThemeable'
import Activity from 'rmw-shell/lib/containers/Activity'
import { ResponsiveMenu } from 'material-ui-responsive-menu'
import { change, submit } from 'redux-form'
import { connect } from 'react-redux'
import { filterActions } from 'material-ui-filter'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'


//const path = 'workflow_steps'
const form_name = 'workflow_step'

class WorkflowStep extends Component {

    validate = (values) => {
        const { intl } = this.props
        const errors = {}


        errors.name = !values.name ? intl.formatMessage({ id: 'error_required_field' }) : ''

        return errors
    }


    handleClose = () => {
        const { setSimpleValue } = this.props
        setSimpleValue('delete_workflow_step', false)
    }

    handleDelete = () => {
        const { history, match, firebaseApp, path } = this.props
        const uid = match.params.uid

        if (uid) {
            firebaseApp.database().ref().child(`/${path}/${uid}`).remove().then(() => {
                this.handleClose()
                history.goBack()
            })
        }
    }


    render() {
        const {
      history,
            intl,
            setSimpleValue,
            match,
            submit,
            muiTheme,
            isGranted,
            delete_company,
            uid,
            firebaseApp,
            path
    } = this.props

        const actions = [
            <FlatButton
                label={intl.formatMessage({ id: 'cancel' })}
                primary={true}
                onClick={this.handleClose}
            />,
            <FlatButton
                label={intl.formatMessage({ id: 'delete' })}
                secondary={true}
                onClick={this.handleDelete}
            />,
        ]

        const menuList = [
            {
                hidden: (uid === undefined && !isGranted(`create_${form_name}`)) || (uid !== undefined && !isGranted(`edit_${form_name}`)),
                text: intl.formatMessage({ id: 'save' }),
                icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>save</FontIcon>,
                tooltip: intl.formatMessage({ id: 'save' }),
                onClick: () => { submit('workflow_step') }
            },
            {
                hidden: uid === undefined || !isGranted(`delete_${form_name}`),
                text: intl.formatMessage({ id: 'delete' }),
                icon: <FontIcon className="material-icons" color={muiTheme.palette.canvasColor}>delete</FontIcon>,
                tooltip: intl.formatMessage({ id: 'delete' }),
                onClick: () => { setSimpleValue('delete_workflow', true) }
            }
        ]

        return (
            <Activity
                iconElementRight={
                    <div style={{ display: 'flex' }}>
                        <div style={{ position: 'absolute', right: 10, width: '12%' }}>
                            <ResponsiveMenu
                                iconMenuColor={muiTheme.palette.canvasColor}
                                menuList={menuList}
                            />
                        </div>
                    </div>
                }
                onBackClick={() => history.goBack()}
                title={intl.formatMessage({ id: match.params.uid ? 'edit_workflow' : 'create_workflow' })}>


                <FireForm
                    firebaseApp={firebaseApp}
                    name={form_name}
                    path={`/${path}/`}
                    validate={this.validate}
                    onSubmitSuccess={() => history.goBack()}
                    onDelete={() => history.goBack()}
                    uid={match.params.uid}>
                    <WorkflowStepForm
                        handleContactSelected={this.handleContactSelected}
                        handlePhotoUploadSuccess={this.handlePhotoUploadSuccess}
                    />
                </FireForm>


                <Dialog
                    title={intl.formatMessage({ id: 'delete_company_title' })}
                    actions={actions}
                    modal={false}
                    open={delete_company === true}
                    onRequestClose={this.handleClose}>
                    {intl.formatMessage({ id: 'delete_company_message' })}
                </Dialog>
            </Activity>
        )
    }
}

WorkflowStep.propTypes = {
    history: PropTypes.object,
    intl: intlShape.isRequired,
    match: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    muiTheme: PropTypes.object.isRequired,
    isGranted: PropTypes.func.isRequired,
}


const mapStateToProps = (state, ownProps) => {
    const { intl, simpleValues } = state
    const { match } = ownProps

    const uid = match.params.uid
    const workflowUid = match.params.workflowUid
    const delete_company = simpleValues.delete_company

    const path = `workflow_steps/${workflowUid}`

    return {
        path,
        uid,
        delete_company,
        intl,
        isGranted: grant => isGranted(state, grant)
    }
}

export default connect(
    mapStateToProps, { setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(WorkflowStep)))))
