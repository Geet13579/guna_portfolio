import { Component } from 'react';

/** Catches WebGL / 3D failures and renders the provided 2D fallback. */
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err) {
    console.warn('[3D disabled — showing 2D fallback]', err);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
