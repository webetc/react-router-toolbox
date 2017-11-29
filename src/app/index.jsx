// @flow

import React from 'react'
import {BrowserRouter as Router, Redirect, Route, Switch} from 'react-router-dom'
import isBrowser from 'react-toolbox/lib/utils/is-browser'
import breakpoints from 'react-toolbox/lib/utils/breakpoints'
import {getViewport} from 'react-toolbox/lib/utils/utils'
import {Layout, NavDrawer, Panel} from 'react-toolbox/lib/layout'
import {AppBar} from 'react-toolbox/lib/app_bar'
import {Navigation} from 'react-toolbox/lib/navigation'
import {List, ListDivider} from 'react-toolbox/lib/list'
import {Link, ListItem} from '../router'
import {themr} from 'react-css-themr'


type Props = {
    title: string,
    routes: any,
    theme: any,
    children: any
}

const NAV_PERM = 'md'

class _AppShell extends React.Component {

    props: Props

    state: {
        sideNavActive: boolean,
        width: number
    }

    historyUnlisten = null

    constructor(props: Props) {
        super(props);
        this.state = {
            sideNavActive: false,
            width: isBrowser() && getViewport().width
        }
    }

    componentDidMount() {
        if (!this.state.width)
            this.handleResize()
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
        if (this.historyUnlisten != null)
            this.historyUnlisten()
    }

    handleResize = () => {
        this.setState({width: getViewport().width})
    }

    handleToggleNav() {
        this.setState({sideNavActive: !this.state.sideNavActive})
    }

    closeNav = () => {
        this.setState({sideNavActive: false})
    }

    render() {
        return (
            <Router>
                <Route path='/' render={this.renderLayout}/>
            </Router>
        )
    }

    renderLayout = ({history}) => {
        const {routes, children} = this.props

        if (this.historyUnlisten == null)
            this.historyUnlisten = history.listen(this.closeNav)

        return (
            <div>
                {children}
                <Switch>
                    {
                        routes.map((route) => (
                            <SecureRoute key={route.to} path={route.to} exact={route.exact} route={route}
                                         render={this.renderRouteLayout}/>
                        ))
                    }
                </Switch>
            </div>
        )
    }

    renderRouteLayout = ({route, ...rest}) => {
        const {sideNavActive} = this.state
        const {routes, title, theme} = this.props
        const useMenuNav = this.state.width <= breakpoints[NAV_PERM]
        const haveSideNav = useMenuNav || route.drawer != null
        const showBack = useMenuNav && route.menu == null && route.title != null && route.drawer == null
        const showMore = useMenuNav && route.actionMenu != null

        return (
            <Layout>
                <NavDrawer
                    className={theme.navDrawer}
                    active={haveSideNav && sideNavActive}
                    clipped={true}
                    onOverlayClick={() => {
                        this.handleToggleNav()
                    }}
                    permanentAt={haveSideNav ? NAV_PERM : null}
                >
                    <AppNavDrawerContents Component={route.drawer} menus={routes}
                                          showMenus={useMenuNav} {...rest} />
                </NavDrawer>

                <AppBar
                    className={theme.appBar}
                    fixed
                    leftIcon={showBack ? 'arrow_back' : haveSideNav ? 'menu' : null}
                    onLeftIconClick={() => {
                        if (showBack)
                            window.history.back();
                        else
                            this.handleToggleNav()
                    }}
                    title={useMenuNav && route.title != null ? route.title : title}
                >
                    <AppNavContents menus={routes} showMenus={useMenuNav}
                                    ActionMenu={route.actionMenu}/>
                </AppBar>

                <AppPanel theme={theme} route={route} {...rest}/>
            </Layout>
        )
    }

}


const SecureRoute = ({path, exact, render, route}) => {
    const redirectTo = route.redirect == null ? null : route.redirect()

    return (
        <Route path={path} exact={exact} render={(props) => {
            if (redirectTo == null)
                return render({route, ...props})
            else
                return (
                    <Redirect to={{
                        pathname: redirectTo,
                        state: {from: props.location}
                    }}/>
                )
        }}/>
    )
}


const AppNavDrawerContents = ({Component, menus, showMenus, ...rest}) => {
    if (Component == null && !showMenus) {
        return (null)
    } else if (!showMenus) {
        return (
            <Component {...rest} />
        )
    } else if (Component == null) {
        return (
            <List>
                {
                    filterMenus(menus).map((m2) => (
                        <ListItem key={m2.menu} to={m2.to} caption={m2.menu} selectable ripple/>
                    ))
                }
            </List>
        )
    } else {
        return (
            <List>
                {
                    filterMenus(menus).map((m2) => (
                        <ListItem key={m2.menu} to={m2.to} caption={m2.menu} selectable ripple/>
                    ))
                }
                <ListDivider/>
                <Component {...rest} />
            </List>
        )
    }
}


const AppNavContents = ({menus, showMenus, ActionMenu}) => {
    if (showMenus) {
        return (
            <Navigation type="horizontal">
                {ActionMenu != null ? <ActionMenu/> : null}
            </Navigation>
        )
    } else {
        return <Navigation type="horizontal">
            {
                filterMenus(menus).map((m2) => (
                    <Link key={m2.menu} to={m2.to}>{m2.menu}</Link>
                ))
            }
        </Navigation>
    }
}


class AppPanel extends React.Component {

    shouldComponentUpdate(nextProps) {
        return (this.props.location.pathname != nextProps.location.pathname || nextProps.route.main !== this.props.route.main)
    }

    render() {
        const {theme, route, ...rest} = this.props
        return (
            <Panel className={theme.panel} bodyScroll={true}>
                {React.createElement(route.main, {...rest})}
            </Panel>
        )
    }
}


function filterMenus(menus) {
    return menus.filter((m) => (m.menu != null && (m.secure == null || m.secure() == null)))
}


export const AppShell = themr('AppShell')(_AppShell);
