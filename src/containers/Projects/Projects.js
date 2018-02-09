import React, { Component } from 'react'
import { connect } from 'react-redux'
import { injectIntl, intlShape } from 'react-intl'
import Activity from 'rmw-shell/lib/containers/Activity'
import { List } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import { withFirebase } from 'firekit-provider'
import { withRouter } from 'react-router-dom'
import ReactList from 'react-list'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import FontIcon from 'material-ui/FontIcon'
import muiThemeable from 'material-ui/styles/muiThemeable'
import isGranted from 'rmw-shell/lib/utils/auth'
import PropTypes from 'prop-types'
import Scrollbar from 'rmw-shell/lib/components/Scrollbar'
import { filterActions } from 'material-ui-filter'
import { getList } from 'firekit'
import ProjectItem from './ProjectItem'

class Projects extends Component {

  componentDidMount() {
    const { watchList, setSearch, path } = this.props
    setSearch('projects', '')
    watchList(path)
  }

  handleCreate = () => {
    const { history } = this.props

    history.push(`/workflows/select`)

  }

  renderItem = (i, k) => {
    const { list } = this.props

    const key = list[i].key

    return <div key={key}><ProjectItem {...this.props} projectKey={key} /><Divider /></div>
  }

  render() {
    const {
      list,
      isGranted
      } = this.props


    return (
      <Activity
        iconStyleRight={{ width: '100%', textAlign: 'center', marginLeft: 0 }}
        isLoading={list === undefined}>

        <div style={{ height: '100%' }}>
          <Scrollbar>
            <List ref={field => this.list = field}>
              <ReactList
                itemRenderer={this.renderItem}
                length={list ? list.length : 0}
                type='simple'
              />
            </List>
          </Scrollbar>
          <div
            style={{ float: "left", clear: "both" }}
          />
          {
            isGranted('create_workflow') &&
            <FloatingActionButton
              onClick={this.handleCreate}
              style={{ position: 'fixed', bottom: 15, right: 20, zIndex: 99 }}
              secondary={true}>
              <FontIcon className="material-icons" >add</FontIcon>
            </FloatingActionButton>
          }
        </div>
      </Activity>
    )
  }
}

Projects.propTypes = {
  intl: intlShape.isRequired,
  isGranted: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => {
  const { match } = ownProps
  const uid = match.params.uid

  const path = `user_projects/${uid}`

  return {
    path,
    uid,
    list: getList(state, path),
    isGranted: grant => isGranted(state, grant)
  }
}


export default connect(
  mapStateToProps, { ...filterActions }
)(injectIntl(withFirebase(withRouter(muiThemeable()(Projects)))))
