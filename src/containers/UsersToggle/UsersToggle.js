import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { injectIntl, intlShape } from 'react-intl'
import muiThemeable from 'material-ui/styles/muiThemeable'
import { setSimpleValue } from 'rmw-shell/lib/store/simpleValues/actions'
import { withRouter } from 'react-router-dom'
import FontIcon from 'material-ui/FontIcon'
import { withFirebase } from 'firekit-provider'
import { ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar'
import Toggle from 'material-ui/Toggle'
import ReactList from 'react-list'
import { List } from 'material-ui/List'
import { FilterDrawer, filterSelectors, filterActions } from 'material-ui-filter'


class UsersToggle extends Component {

  componentWillMount() {
    const { watchList, path, setSearch } = this.props

    setSearch('users_toggle', '')
    watchList(path)
  }

  renderGrantItem = (list, i, k) => {
    const { getValue, onToggle } = this.props

    const userUid = list[i].key
    const user = list[i].val
    const toggled = getValue(userUid)

    return <div key={i}>
      <ListItem
        leftAvatar={
          <Avatar
            src={user.photoURL}
            alt="person"
            icon={<FontIcon className="material-icons">person</FontIcon>}
          />
        }
        rightToggle={
          <Toggle
            toggled={toggled === true}
            onToggle={(e, newVal) => onToggle(userUid, newVal)}
          />
        }
        key={userUid}
        id={userUid}
        primaryText={<div style={{ fontFamily: 'Roboto' }}>{user.displayName}</div>}
        secondaryText={<div style={{ fontFamily: 'Roboto' }}>{user.email}</div>}
      />
      <Divider inset={true} />
    </div>
  }

  render() {
    const {
      intl,
      list
    } = this.props

    const filterFields = [
      {
        name: 'displayName',
        label: intl.formatMessage({ id: 'name_label' })
      },
      {
        name: 'value',
        label: intl.formatMessage({ id: 'value_label' })
      }
    ]

    return (
      <div>
        <List style={{ height: '100%' }} ref={(field) => { this.list = field }}>
          <ReactList
            itemRenderer={(i, k) => this.renderGrantItem(list, i, k)}
            length={list ? list.length : 0}
            type='simple'
          />
        </List>
        <FilterDrawer
          name={'users_toggle'}
          fields={filterFields}
          formatMessage={intl.formatMessage}
        />
      </div>
    )
  }
}


UsersToggle.propTypes = {
  intl: intlShape.isRequired,
  muiTheme: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
}


const mapStateToProps = (state, ownProps) => {
  const { auth, intl, lists, filters } = state
  const { getValue, onToggle } = ownProps

  const path = 'users'
  const list = filterSelectors.getFilteredList('users_toggle', filters, lists[path], fieldValue => fieldValue.val)

  return {
    path,
    getValue: getValue ? getValue : () => false,
    onToggle: onToggle ? onToggle : () => { },
    list,
    filters,
    auth,
    intl,
    user_grants: lists.user_grants
  }
}

export default connect(
  mapStateToProps, { setSimpleValue, ...filterActions }
)(injectIntl(withRouter(withFirebase(muiThemeable()(UsersToggle)))))
