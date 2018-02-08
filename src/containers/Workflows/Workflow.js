import Activity from 'rmw-shell/lib/containers/Activity'
import Dialog from 'material-ui/Dialog'
import FireForm from 'fireform';
import FlatButton from 'material-ui/FlatButton'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SearchField from 'rmw-shell/lib/components/SearchField'
import WorkflowForm from '../../components/Forms/WorkflowForm'
import WorkflowSteps from '../WorkflowSteps/WorkflowSteps'
import isGranted from 'rmw-shell/lib/utils/auth'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { ResponsiveMenu } from 'material-ui-responsive-menu'
import { Tabs, Tab } from 'material-ui/Tabs'
import { change, submit } from 'redux-form'
import { connect } from 'react-redux'
import { filterActions } from 'material-ui-filter'
import { injectIntl, intlShape } from 'react-intl'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'


const path = 'workflows'
const form_name = 'workflow'

class Workflow extends Component {

    validate = (values) => {
        const { intl, companies, uid } = this.props
        const errors = {}

        let nameDuplicate = false
        if (companies) {
            companies.forEach(company => {
                if (company.key !== uid && ((company.val.subcontractor !== true) === (values.subcontractor !== true)) && (company.val.name === values.name)) {
                    nameDuplicate = true
                }
            })
        }


        errors.name = !values.name ? intl.formatMessage({ id: 'error_required_field' }) : ''
        errors.name = nameDuplicate ? intl.formatMessage({ id: 'error_name_exists' }) : errors.name
        errors.full_name = !values.full_name ? intl.formatMessage({ id: 'error_required_field' }) : ''
        errors.vat = !values.vat ? intl.formatMessage({ id: 'error_required_field' }) : ''

        return errors
    }

    componentDidMount() {
        const { watchList, userCompaniesPath, setSearch } = this.props
        setSearch('users_toggle', '')
        watchList(userCompaniesPath)
        watchList(path)
    }

    handleClose = () => {
        const { setSimpleValue } = this.props
        setSimpleValue('delete_workflow', false)
    }

    handleDelete = () => {
        const { history, match, firebaseApp } = this.props
        const uid = match.params.uid

        if (uid) {
            firebaseApp.database().ref().child(`/${path}/${uid}`).remove().then(() => {
                this.handleClose()
                history.goBack()
            })
        }
    }

    handlePhotoUploadSuccess = (snapshot) => {
        const { setSimpleValue, change } = this.props
        change(form_name, 'photoURL', snapshot.downloadURL)
        setSimpleValue('new_company_photo', undefined)
    }

    handleTabActive = (value) => {
        const { history, uid } = this.props
        history.replace(`/${path}/edit/${uid}/${value}`)
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
            delete_workflow,
            editType,
            uid,
            setSearch,
            firebaseApp
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
                onClick: () => { submit('workflow') }
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
                iconStyleRight={editType === 'users' ? { width: '100%', textAlign: 'center', marginLeft: 0 } : {}}
                iconElementRight={
                    <div style={{ display: 'flex' }}>
                        {
                            editType === 'users' &&
                            <div style={{ width: 'calc(100% - 84px)' }}>
                                <SearchField
                                    onChange={(e, newVal) => {
                                        setSearch('users_toggle', newVal)
                                    }}
                                    hintText={`${intl.formatMessage({ id: 'user_label' })} ${intl.formatMessage({ id: 'search' })}`}
                                />
                            </div>
                        }
                        <div style={{ position: 'absolute', right: 10, width: '12%' }}>
                            <ResponsiveMenu
                                iconMenuColor={muiTheme.palette.canvasColor}
                                menuList={menuList}
                            />
                        </div>
                    </div>
                }
                onBackClick={() => history.goBack()}
                title={editType === 'users' ? undefined : intl.formatMessage({ id: match.params.uid ? 'edit_workflow' : 'create_workflow' })}>

                <Tabs
                    value={editType}
                    onChange={this.handleTabActive}>
                    <Tab
                        value={'data'}
                        icon={<FontIcon className="material-icons">local_activity</FontIcon>}>
                        {
                            editType === 'data' &&
                            <div style={{ margin: 15, display: 'flex' }}>
                                <FireForm
                                    firebaseApp={firebaseApp}
                                    name={form_name}
                                    path={`/${path}/`}
                                    validate={this.validate}
                                    onSubmitSuccess={() => history.goBack()}
                                    onDelete={() => history.goBack()}
                                    uid={match.params.uid}>
                                    <WorkflowForm
                                        handleContactSelected={this.handleContactSelected}
                                        handlePhotoUploadSuccess={this.handlePhotoUploadSuccess}
                                    />
                                </FireForm>
                            </div>
                        }
                    </Tab>
                    {uid &&
                        <Tab
                            value={'steps'}
                            icon={<FontIcon className="material-icons">timeline</FontIcon>}>
                            {
                                editType === 'steps' &&
                                <WorkflowSteps  {...this.props} />
                            }
                        </Tab>
                    }
                </Tabs>

                <Dialog
                    title={intl.formatMessage({ id: 'delete_workflow_title' })}
                    actions={actions}
                    modal={false}
                    open={delete_workflow === true}
                    onRequestClose={this.handleClose}>
                    {intl.formatMessage({ id: 'delete_workflow_message' })}
                </Dialog>
            </Activity>
        )
    }
}

Workflow.propTypes = {
    history: PropTypes.object,
    intl: intlShape.isRequired,
    match: PropTypes.object.isRequired,
    submit: PropTypes.func.isRequired,
    muiTheme: PropTypes.object.isRequired,
    isGranted: PropTypes.func.isRequired,
}


const mapStateToProps = (state, ownProps) => {
    const { intl, simpleValues, lists } = state
    const { match } = ownProps

    const uid = match.params.uid
    const editType = match.params.editType ? match.params.editType : 'data'
    const delete_workflow = simpleValues.delete_workflow

    const userCompaniesPath = `user_companies/`
    const userCompanies = lists[userCompaniesPath] ? lists[userCompaniesPath] : []

    const companies = lists[path]

    return {
        companies,
        userCompaniesPath,
        userCompanies,
        uid,
        editType,
        delete_workflow,
        intl,
        isGranted: grant => isGranted(state, grant)
    }
}

export default connect(
    mapStateToProps, { setSimpleValue, change, submit, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(Workflow)))))
