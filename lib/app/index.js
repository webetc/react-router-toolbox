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
import { ListItemLink, SimpleLink } from '../router';
import { themr } from 'react-css-themr';

var NAV_PERM = 'md';

var _AppShell = function (_React$Component) {
    _inherits(_AppShell, _React$Component);

    function _AppShell(props) {
        _classCallCheck(this, _AppShell);

        var _this = _possibleConstructorReturn(this, (_AppShell.__proto__ || Object.getPrototypeOf(_AppShell)).call(this, props));

        _this.historyUnlisten = null;

        _this.handleResize = function () {
            _this.setState({ width: getViewport().width });
        };

        _this.closeNav = function () {
            _this.setState({ sideNavActive: false });
        };

        _this.renderLayout = function (_ref) {
            var history = _ref.history;
            var _this$props = _this.props,
                routes = _this$props.routes,
                children = _this$props.children;


            if (_this.historyUnlisten == null) _this.historyUnlisten = history.listen(_this.closeNav);

            return React.createElement(
                'div',
                null,
                children,
                React.createElement(
                    Switch,
                    null,
                    routes.map(function (route) {
                        return React.createElement(SecureRoute, { key: route.to, path: route.to, exact: route.exact, route: route,
                            render: _this.renderRouteLayout });
                    })
                )
            );
        };

        _this.renderRouteLayout = function (_ref2) {
            var route = _ref2.route,
                rest = _objectWithoutProperties(_ref2, ['route']);

            var sideNavActive = _this.state.sideNavActive;
            var _this$props2 = _this.props,
                routes = _this$props2.routes,
                title = _this$props2.title,
                theme = _this$props2.theme;

            var useMenuNav = _this.state.width <= breakpoints[NAV_PERM];
            var haveSideNav = useMenuNav || route.drawer != null;
            var showBack = useMenuNav && route.menu == null && route.title != null && route.drawer == null;
            var showMore = useMenuNav && route.actionMenu != null;
            var TitleComponent = _this.props.titleComponent != null ? _this.props.titleComponent : TitleContent;

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
                            _this.handleToggleNav();
                        },
                        permanentAt: haveSideNav ? NAV_PERM : null
                    },
                    React.createElement(AppNavDrawerContents, _extends({ Component: route.drawer, menus: routes,
                        showMenus: useMenuNav }, rest))
                ),
                React.createElement(
                    AppBar,
                    {
                        className: theme.appBar,
                        fixed: true,
                        leftIcon: showBack ? 'arrow_back' : haveSideNav ? 'menu' : null,
                        onLeftIconClick: function onLeftIconClick() {
                            if (showBack) window.history.back();else _this.handleToggleNav();
                        },
                        title: React.createElement(TitleComponent, { mobile: useMenuNav, routeTitle: route.title, appTitle: title })
                    },
                    React.createElement(AppNavContents, { menus: routes, showMenus: useMenuNav,
                        ActionMenu: route.actionMenu })
                ),
                React.createElement(AppPanel, _extends({ theme: theme, route: route }, rest))
            );
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
            if (this.historyUnlisten != null) this.historyUnlisten();
        }
    }, {
        key: 'handleToggleNav',
        value: function handleToggleNav() {
            this.setState({ sideNavActive: !this.state.sideNavActive });
        }
    }, {
        key: 'render',
        value: function render() {
            return React.createElement(
                Router,
                { basename: this.props.basename },
                React.createElement(Route, { path: '/', render: this.renderLayout })
            );
        }
    }]);

    return _AppShell;
}(React.Component);

var SecureRoute = function SecureRoute(_ref3) {
    var path = _ref3.path,
        exact = _ref3.exact,
        _render = _ref3.render,
        route = _ref3.route;

    var redirectTo = route.redirect == null ? null : route.redirect();

    return React.createElement(Route, { path: path, exact: exact, render: function render(props) {
            if (redirectTo == null) return _render(_extends({ route: route }, props));else return React.createElement(Redirect, { to: {
                    pathname: redirectTo,
                    state: { from: props.location }
                } });
        } });
};

var TitleContent = function TitleContent(_ref4) {
    var mobile = _ref4.mobile,
        appTitle = _ref4.appTitle,
        routeTitle = _ref4.routeTitle;

    if (mobile && routeTitle != null) return routeTitle;else return appTitle;
};

var AppNavDrawerContents = function AppNavDrawerContents(_ref5) {
    var Component = _ref5.Component,
        menus = _ref5.menus,
        showMenus = _ref5.showMenus,
        rest = _objectWithoutProperties(_ref5, ['Component', 'menus', 'showMenus']);

    if (Component == null && !showMenus) {
        return null;
    } else if (!showMenus) {
        return React.createElement(Component, rest);
    } else if (Component == null) {
        return React.createElement(
            List,
            null,
            filterMenus(menus).map(function (m2) {
                return React.createElement(ListItemLink, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            })
        );
    } else {
        return React.createElement(
            List,
            null,
            filterMenus(menus).map(function (m2) {
                return React.createElement(ListItemLink, { key: m2.menu, to: m2.to, caption: m2.menu, selectable: true, ripple: true });
            }),
            React.createElement(ListDivider, null),
            React.createElement(Component, rest)
        );
    }
};

var AppNavContents = function AppNavContents(_ref6) {
    var menus = _ref6.menus,
        showMenus = _ref6.showMenus,
        ActionMenu = _ref6.ActionMenu;

    if (showMenus) {
        return React.createElement(
            Navigation,
            { type: 'horizontal' },
            ActionMenu != null ? React.createElement(ActionMenu, null) : null
        );
    } else {
        return React.createElement(
            Navigation,
            { type: 'horizontal' },
            filterMenus(menus).map(function (m2) {
                return React.createElement(
                    SimpleLink,
                    { key: m2.menu, to: m2.to },
                    m2.menu
                );
            })
        );
    }
};

var AppPanel = function (_React$Component2) {
    _inherits(AppPanel, _React$Component2);

    function AppPanel() {
        _classCallCheck(this, AppPanel);

        return _possibleConstructorReturn(this, (AppPanel.__proto__ || Object.getPrototypeOf(AppPanel)).apply(this, arguments));
    }

    _createClass(AppPanel, [{
        key: 'shouldComponentUpdate',
        value: function shouldComponentUpdate(nextProps) {
            return this.props.location.pathname != nextProps.location.pathname || nextProps.route.main !== this.props.route.main;
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                theme = _props.theme,
                route = _props.route,
                rest = _objectWithoutProperties(_props, ['theme', 'route']);

            return React.createElement(
                Panel,
                { className: theme.panel, bodyScroll: true },
                React.createElement(route.main, _extends({}, rest))
            );
        }
    }]);

    return AppPanel;
}(React.Component);

function filterMenus(menus) {
    return menus.filter(function (m) {
        return m.menu != null && (m.redirect == null || m.redirect() == null);
    });
}

export var AppShell = themr('AppShell')(_AppShell);