var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import isBrowser from 'react-toolbox/lib/utils/is-browser';
import breakpoints from 'react-toolbox/lib/utils/breakpoints';
import { getViewport } from 'react-toolbox/lib/utils/utils';
import { Layout, NavDrawer, Panel } from 'react-toolbox/lib/layout';
import { AppBar } from 'react-toolbox/lib/app_bar';
import { Navigation } from 'react-toolbox/lib/navigation';
import { List, ListDivider } from 'react-toolbox/lib/list';
import { Link, ListItem } from '../router';
import { themr } from 'react-css-themr';

var NAV_PERM = 'md';

var _AppShell = function (_React$Component) {
    _inherits(_AppShell, _React$Component);

    function _AppShell(props) {
        _classCallCheck(this, _AppShell);

        var _this = _possibleConstructorReturn(this, (_AppShell.__proto__ || Object.getPrototypeOf(_AppShell)).call(this, props));

        _this.handleResize = function () {
            _this.setState({ width: getViewport().width });
        };

        _this.state = {
            sideNavActive: false,
            width: isBrowser() && getViewport().width
        };
        return _this;
    }

    _createClass(_AppShell, [{
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
                title = _props.title,
                theme = _props.theme;

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
                        return React.createElement(SecureRoute, { key: route.to, exact: route.exact, path: route.to, secure: route.secure,
                            render: function render(_ref) {
                                var match = _ref.match;
                                return React.createElement(
                                    Layout,
                                    null,
                                    React.createElement(
                                        NavDrawer,
                                        {
                                            className: theme.navDrawer,
                                            active: haveSideNav && sideNavActive,
                                            clipped: true,
                                            onOverlayClick: function onOverlayClick() {
                                                _this2.handleToggleNav();
                                            },
                                            permanentAt: haveSideNav ? NAV_PERM : null
                                        },
                                        React.createElement(AppNavDrawerContents, { Component: route.drawer, menus: routes,
                                            showMenus: useMenuNav, match: match })
                                    ),
                                    React.createElement(
                                        AppBar,
                                        {
                                            className: theme.appBar,
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
                                        { className: theme.panel, bodyScroll: true },
                                        React.createElement(Route, { key: route.to, exact: route.exact, path: route.to,
                                            component: route.main })
                                    )
                                );
                            }
                        });
                    })
                )
            );
        }
    }]);

    return _AppShell;
}(React.Component);

var SecureRoute = function SecureRoute(_ref2) {
    var _render = _ref2.render,
        secure = _ref2.secure,
        rest = _objectWithoutProperties(_ref2, ['render', 'secure']);

    var secured = secure == null ? null : secure();
    return React.createElement(Route, _extends({}, rest, { render: function render(props) {
            if (secured == null) return _render(props);else return React.createElement(Redirect, { to: {
                    pathname: secured,
                    state: { from: props.location }
                } });
        } }));
};

var AppNavDrawerContents = function AppNavDrawerContents(_ref3) {
    var Component = _ref3.Component,
        menus = _ref3.menus,
        showMenus = _ref3.showMenus,
        match = _ref3.match;

    if (Component == null && !showMenus) {
        return null;
    } else if (!showMenus) {
        return React.createElement(Component, { match: match });
    } else if (Component == null) {
        return React.createElement(
            List,
            null,
            filterMenus(menus).map(function (m2) {
                return React.createElement(ListItem, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            })
        );
    } else {
        return React.createElement(
            List,
            null,
            filterMenus(menus).map(function (m2) {
                return React.createElement(ListItem, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            }),
            React.createElement(ListDivider, null),
            React.createElement(Component, { match: match })
        );
    }
};

var AppNavContents = function AppNavContents(_ref4) {
    var menus = _ref4.menus,
        showMenus = _ref4.showMenus;

    return showMenus ? null : React.createElement(
        Navigation,
        { type: 'horizontal' },
        filterMenus(menus).map(function (m2) {
            return React.createElement(
                Link,
                { key: m2.menu, to: m2.to },
                m2.menu
            );
        })
    );
};

function filterMenus(menus) {
    return menus.filter(function (m) {
        return m.menu != null && (m.secure == null || m.secure() == null);
    });
}

export var AppShell = themr('AppShell')(_AppShell);