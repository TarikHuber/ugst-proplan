import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { ListItem } from 'material-ui/List'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import isGranted from 'rmw-shell/lib/utils/auth'
import { filterActions } from 'material-ui-filter'
import { getPath, getList } from 'firekit'

class ProjectItem extends Component {
  componentWillMount() {
    const { watchPath, watchList, path, projectKey } = this.props

    watchPath(path)
    watchList(`project_steps/${projectKey}`)
  }

  componentWillUnmount() {
    const { unwatchPath, path } = this.props
    unwatchPath(path)
  }

  getNextStep = (steps) => {


    for (const step of steps) {
      if (!step.done || step.done === undefined) {
        return step.name
      }

      if (step.steps) {
        if (this.getNextStep(step.steps)) {
          return this.getNextStep(step.steps)
        }
      }
    }


  }

  render() {
    const { history, val, projectKey } = this.props

    return (<ListItem
      onClick={() => history.push(`/projects/edit/${projectKey}/data`)}
      key={projectKey}
      id={projectKey}
      primaryText={val.steps ? this.getNextStep(val.steps) : ''}
      secondaryText={val.name}
    />
    )
  }
}

ProjectItem.propTypes = {
  intl: intlShape.isRequired
}

const mapStateToProps = (state, ownProps) => {
  const { auth } = state
  const { projectKey } = ownProps

  const path = `projects/${projectKey}`

  return {
    auth,
    path,
    projectKey,
    val: getPath(state, path) ? getPath(state, path) : {},
    projectSteps: getList(state, `project_steps/${projectKey}`),
    isGranted: grant => isGranted(state, grant)
  }
}

export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(withFirebase(withRouter(muiThemeable()(ProjectItem)))))
