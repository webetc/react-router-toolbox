var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import { createLocation } from 'history';
import { matchPath } from 'react-router';

var isModifiedEvent = function isModifiedEvent(event) {
    return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
};

function asLink(Component) {
    var _class, _temp2;

    return _temp2 = _class = function (_React$Component) {
        _inherits(Link, _React$Component);

        function Link() {
            var _ref;

            var _temp, _this, _ret;

            _classCallCheck(this, Link);

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                args[_key] = arguments[_key];
            }

            return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Link.__proto__ || Object.getPrototypeOf(Link)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function (event) {
                if (_this.props.onClick) _this.props.onClick(event);

                if (!event.defaultPrevented && // onClick prevented default
                event.button === 0 && // ignore everything but left clicks
                !_this.props.target && // let browser handle "target=_blank" etc.
                !isModifiedEvent(event) // ignore clicks with modifier keys
                ) {
                        event.preventDefault();

                        var history = _this.context.router.history;
                        var _this$props = _this.props,
                            replace = _this$props.replace,
                            to = _this$props.to;


                        if (replace) {
                            history.replace(to);
                        } else {
                            history.push(to);
                        }
                    }
            }, _temp), _possibleConstructorReturn(_this, _ret);
        }

        _createClass(Link, [{
            key: 'render',
            value: function render() {
                var _props = this.props,
                    replace = _props.replace,
                    to = _props.to,
                    innerRef = _props.innerRef,
                    matchClass = _props.matchClass,
                    className = _props.className,
                    props = _objectWithoutProperties(_props, ['replace', 'to', 'innerRef', 'matchClass', 'className']); // eslint-disable-line no-unused-vars


                var componentClassName = className;

                invariant(this.context.router, 'You should not use <Link> outside a <Router>');

                var _context$router = this.context.router,
                    history = _context$router.history,
                    route = _context$router.route;

                var location = typeof to === 'string' ? createLocation(to, null, null, history.location) : to;

                if (matchClass != null) {
                    var match = matchPath(route.location.pathname, { path: to, exact: true });
                    if (!!match) {
                        componentClassName += " " + matchClass;
                    }
                }

                var href = history.createHref(location);
                return React.createElement(Component, _extends({
                    onClick: this.handleClick,
                    to: href,
                    href: href,
                    ref: innerRef,
                    className: componentClassName
                }, props));
            }
        }]);

        return Link;
    }(React.Component), _class.propTypes = {
        onClick: PropTypes.func,
        target: PropTypes.string,
        replace: PropTypes.bool,
        to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
        matchClass: PropTypes.string,
        innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
    }, _class.defaultProps = {
        replace: false
    }, _class.contextTypes = {
        router: PropTypes.shape({
            history: PropTypes.shape({
                push: PropTypes.func.isRequired,
                replace: PropTypes.func.isRequired,
                createHref: PropTypes.func.isRequired
            }).isRequired
        }).isRequired
    }, _temp2;
}

export default asLink;