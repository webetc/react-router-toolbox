// @flow

import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import isBrowser from 'react-toolbox/lib/utils/is-browser'
import breakpoints from 'react-toolbox/lib/utils/breakpoints'
import { getViewport } from 'react-toolbox/lib/utils/utils'
import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout'
import { AppBar } from 'react-toolbox/lib/app_bar'
import { Navigation } from 'react-toolbox/lib/navigation'
import { List, ListSubHeader, ListDivider } from 'react-toolbox/lib/list'
import { Link, ListItem } from '../router'

type Props = {
    title: string,
    menus: any
}

const NAV_PERM = 'md'

export class AppShell extends React.Component {

    props:Props

    state:{
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
        this.setState({ width: getViewport().width })
    }

    handleToggleNav(){
        this.setState({ sideNavActive: !this.state.sideNavActive })
    }

    render() {
        const { sideNavActive } = this.state
        const { menus, title} = this.props
        const useMenuNav = this.state.width <= breakpoints[NAV_PERM]

        return (
            <Router>
                <div>
                {
                    menus.map((m)=> {
                        let haveSideNav = useMenuNav || m.leftSide != null
                        return(
                            <Route key={m.to} exact={m.exact} path={m.to} render={({match}) => (
                                <Layout>
                                    <NavDrawer
                                        active={haveSideNav && sideNavActive}
                                        clipped={true}
                                        onOverlayClick={() => {
                                            this.handleToggleNav()
                                        }}
                                        permanentAt={haveSideNav ? NAV_PERM : null}
                                    >
                                        <AppNavDrawerContents Component={m.leftSide} menus={menus} showMenus={useMenuNav} match={match}/>
                                    </NavDrawer>

                                    <AppBar
                                        fixed
                                        leftIcon={haveSideNav ? 'menu' : null}
                                        onLeftIconClick={() => {
                                            this.handleToggleNav()
                                        }}
                                        title={title}
                                    >
                                        <AppNavContents menus={menus} showMenus={useMenuNav}/>
                                    </AppBar>
    
                                    <Panel bodyScroll={true}>
                                        <Route key={m.to} exact={m.exact} path={m.to} component={m.component}/>
                                    </Panel>
                                </Layout>
                            )}/>
                        )
                    })
                }
                </div>
            </Router>
        )
    }
}


const AppNavDrawerContents = ({Component, menus, showMenus, match}) => {
    if(Component == null && !showMenus){
        return (null)
    }else if(!showMenus){
        return (
            <Component match={match}/>
        )
    }else if(Component == null){
        return (
            <List>
                {
                    menus.map((m2) => (
                        <ListItem key={m2.title} to={m2.to} caption={m2.title} selectable ripple/>
                    ))
                }
            </List>
        )
    }else{
        return (
            <List>
                {
                    menus.map((m2) => (
                        <ListItem key={m2.title} to={m2.to} caption={m2.title} selectable ripple/>
                    ))
                }
                <ListDivider />
                <Component match={match}/>
            </List>
        )
    }
}


const AppNavContents = ({menus, showMenus}) => {
    return showMenus ? null :
        <Navigation type="horizontal">
            {
                menus.map((m2) => (
                    <Link key={m2.title} to={m2.to}>{m2.title}</Link>
                ))
            }
        </Navigation>
}

