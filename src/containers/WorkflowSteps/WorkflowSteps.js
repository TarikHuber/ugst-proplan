import Avatar from 'material-ui/Avatar'
import Divider from 'material-ui/Divider'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactList from 'react-list'
import isGranted from 'rmw-shell/lib/utils/auth'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { List, ListItem } from 'material-ui/List'
import { connect } from 'react-redux'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import { injectIntl, intlShape } from 'react-intl'
import { getList } from 'firekit'

class WorkflowSteps extends Component {

  componentDidMount() {
    const { watchList, path } = this.props
    watchList(path)
  }

  renderItem = (i, k) => {
    const { steps, history, workflowUid, basePath } = this.props

    const key = steps[i].key
    const val = steps[i].val

    return <div key={i}>
      <ListItem
        leftAvatar={
          <Avatar
            src={val.photoURL}
            alt="person"
            icon={
              <FontIcon className="material-icons">
                timeline
              </FontIcon>
            }
          />
        }
        key={i}
        primaryText={`${val.name}`}
        secondaryText={`${val.description}`}
        onClick={() => history.push(`/steps/${basePath}/${workflowUid}/edit/${key}`)}
        id={i}
      />
      <Divider inset={true} />
    </div>
  }

  render() {
    const {
      steps,
      history,
      isGranted,
      basePath,
      workflowUid
    } = this.props

    return (
      <div style={{ height: '100%', width: '100%' }}>
        <List ref={(field) => { this.steps = field }}>
          <ReactList
            itemRenderer={this.renderItem}
            length={steps.length}
            type='simple'
          />
        </List>
        {
          isGranted('create_workflow_step') &&
          <FloatingActionButton
            onClick={() => history.push(`/steps/${basePath}/${workflowUid}/create`)}
            style={{ position: 'fixed', bottom: 15, right: 20, zIndex: 99 }}
            secondary={true}>
            <FontIcon className="material-icons" >add</FontIcon>
          </FloatingActionButton>
        }
      </div>
    )
  }
}

WorkflowSteps.propTypes = {
  steps: PropTypes.array.isRequired,
  history: PropTypes.object,
  intl: intlShape.isRequired,
  isGranted: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { match, basePath } = ownProps

  const workflowUid = match.params.uid
  const path = `${basePath}/${workflowUid}`

  return {
    path,
    basePath,
    workflowUid,
    steps: getList(state, path),
    isGranted: grant => isGranted(state, grant)
  }
}


export default connect(
  mapStateToProps
)(injectIntl(withFirebase(withRouter(muiThemeable()(WorkflowSteps)))))
