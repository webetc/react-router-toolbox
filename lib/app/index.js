var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import isBrowser from 'react-toolbox/lib/utils/is-browser';
import breakpoints from 'react-toolbox/lib/utils/breakpoints';
import { getViewport } from 'react-toolbox/lib/utils/utils';
import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { List, ListSubHeader, ListDivider } from 'react-toolbox/lib/list';
import { Link, ListItem } from '../router';

var NAV_PERM = 'md';

export var AppShell = function (_React$Component) {
    _inherits(AppShell, _React$Component);

    function AppShell(props) {
        _classCallCheck(this, AppShell);

        var _this = _possibleConstructorReturn(this, (AppShell.__proto__ || Object.getPrototypeOf(AppShell)).call(this, props));

        _this.handleResize = function () {
            _this.setState({ width: getViewport().width });
        };

        _this.state = {
            sideNavActive: false,
            width: isBrowser() && getViewport().width
        };
        return _this;
    }

    _createClass(AppShell, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            if (!this.state.width) this.handleResize();
            window.addEventListener('resize', this.handleResize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize);
        }
    }, {
        key: 'handleToggleNav',
        value: function handleToggleNav() {
            this.setState({ sideNavActive: !this.state.sideNavActive });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            var sideNavActive = this.state.sideNavActive;
            var _props = this.props,
                routes = _props.routes,
                title = _props.title;

            var useMenuNav = this.state.width <= breakpoints[NAV_PERM];

            return React.createElement(
                Router,
                null,
                React.createElement(
                    Switch,
                    null,
                    routes.map(function (route) {
                        var haveSideNav = useMenuNav || route.drawer != null;
                        var showBack = useMenuNav && route.menu == null && route.title != null && route.drawer == null;
                        return React.createElement(Route, { key: route.to, exact: route.exact, path: route.to, render: function render(_ref) {
                                var match = _ref.match;
                                return React.createElement(
                                    Layout,
                                    null,
                                    React.createElement(
                                        NavDrawer,
                                        {
                                            active: haveSideNav && sideNavActive,
                                            clipped: true,
                                            onOverlayClick: function onOverlayClick() {
                                                _this2.handleToggleNav();
                                            },
                                            permanentAt: haveSideNav ? NAV_PERM : null
                                        },
                                        React.createElement(AppNavDrawerContents, { Component: route.drawer, menus: routes, showMenus: useMenuNav, match: match })
                                    ),
                                    React.createElement(
                                        AppBar,
                                        {
                                            fixed: true,
                                            leftIcon: showBack ? 'arrow_back' : haveSideNav ? 'menu' : null,
                                            onLeftIconClick: function onLeftIconClick() {
                                                if (showBack) window.history.back();else _this2.handleToggleNav();
                                            },
                                            title: useMenuNav && route.title != null ? route.title : title
                                        },
                                        React.createElement(AppNavContents, { menus: routes, showMenus: useMenuNav })
                                    ),
                                    React.createElement(
                                        Panel,
                                        { bodyScroll: true },
                                        React.createElement(Route, { key: route.to, exact: route.exact, path: route.to, component: route.main })
                                    )
                                );
                            } });
                    })
                )
            );
        }
    }]);

    return AppShell;
}(React.Component);

var AppNavDrawerContents = function AppNavDrawerContents(_ref2) {
    var Component = _ref2.Component,
        menus = _ref2.menus,
        showMenus = _ref2.showMenus,
        match = _ref2.match;

    if (Component == null && !showMenus) {
        return null;
    } else if (!showMenus) {
        return React.createElement(Component, { match: match });
    } else if (Component == null) {
        return React.createElement(
            List,
            null,
            menus.filter(function (m1) {
                return m1.menu != null;
            }).map(function (m2) {
                return React.createElement(ListItem, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            })
        );
    } else {
        return React.createElement(
            List,
            null,
            menus.filter(function (m1) {
                return m1.menu != null;
            }).map(function (m2) {
                return React.createElement(ListItem, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            }),
            React.createElement(ListDivider, null),
            React.createElement(Component, { match: match })
        );
    }
};

var AppNavContents = function AppNavContents(_ref3) {
    var menus = _ref3.menus,
        showMenus = _ref3.showMenus;

    return showMenus ? null : React.createElement(
        Navigation,
        { type: 'horizontal' },
        menus.filter(function (m1) {
            return m1.menu != null;
        }).map(function (m2) {
            return React.createElement(
                Link,
                { key: m2.menu, to: m2.to },
                m2.menu
            );
        })
    );
};