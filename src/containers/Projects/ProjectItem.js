import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import { ListItem } from 'material-ui/List'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable'
import isGranted from 'rmw-shell/lib/utils/auth'
import { filterActions } from 'material-ui-filter'
import { getPath } from 'firekit'

class ProjectItem extends Component {
  componentWillMount() {
    const { watchPath, path } = this.props

    watchPath(path)
  }

  componentWillUnmount() {
    const { unwatchPath, path } = this.props
    unwatchPath(path)
  }

  render() {
    const { history, val, projectKey } = this.props

    return (<ListItem
      onClick={() => history.push(`/projects/edit/${projectKey}/data`)}
      key={projectKey}
      id={projectKey}
      primaryText={val.name}
      secondaryText={val.description ? val.description : ''}
    />)
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
    isGranted: grant => isGranted(state, grant)
  }
}

export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(withFirebase(withRouter(muiThemeable()(ProjectItem)))))
