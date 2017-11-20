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
    theme: any
}

const NAV_PERM = 'md'

class _AppShell extends React.Component {

    props: Props

    state: {
        sideNavActive: boolean,
        width: number
    }

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
    }

    handleResize = () => {
        this.setState({width: getViewport().width})
    }

    handleToggleNav() {
        this.setState({sideNavActive: !this.state.sideNavActive})
    }

    render() {
        const {sideNavActive} = this.state
        const {routes, title, theme} = this.props
        const useMenuNav = this.state.width <= breakpoints[NAV_PERM]

        return (
            <Router>
                <Switch>
                {
                    routes.map((route) => {
                        let haveSideNav = useMenuNav || route.drawer != null
                        let showBack = useMenuNav && route.menu == null && route.title != null && route.drawer == null
                        return (
                            <SecureRoute key={route.to} exact={route.exact} path={route.to} secure={route.secure}
                                         render={({match}) => (
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
                                                                          showMenus={useMenuNav} match={match}/>
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
                                                    <AppNavContents menus={routes} showMenus={useMenuNav}/>
                                                </AppBar>

                                                <Panel className={theme.panel} bodyScroll={true}>
                                                    <Route key={route.to} exact={route.exact} path={route.to}
                                                           component={route.main}/>
                                                </Panel>
                                            </Layout>
                                         )}
                            />
                        )
                    })
                }
                </Switch>
            </Router>
        )
    }
}


const SecureRoute = ({render, secure, ...rest}) => {
    let secured = secure == null ? null : secure()
    return (
        <Route {...rest} render={(props) => {
            if (secured == null)
                return render(props)
            else
                return (
                    <Redirect to={{
                        pathname: secured,
                        state: {from: props.location}
                    }}/>
                )
        }}/>
    )
}


const AppNavDrawerContents = ({Component, menus, showMenus, match}) => {
    if (Component == null && !showMenus) {
        return (null)
    } else if (!showMenus) {
        return (
            <Component match={match}/>
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
                <Component match={match}/>
            </List>
        )
    }
}


const AppNavContents = ({menus, showMenus}) => {
    return showMenus ? null :
        <Navigation type="horizontal">
            {
                filterMenus(menus).map((m2) => (
                    <Link key={m2.menu} to={m2.to}>{m2.menu}</Link>
                ))
            }
        </Navigation>
}

function filterMenus(menus) {
    return menus.filter((m) => (m.menu != null && (m.secure == null || m.secure() == null)))
}


export const AppShell = themr('AppShell')(_AppShell);
