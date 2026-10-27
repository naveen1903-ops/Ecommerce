import React from 'react';
export default class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('ShopEase UI error:', error, info); }
  render() { return this.state.hasError ? <main className="page-container"><section className="message-card"><h1>Something went wrong</h1><p>Please refresh the page and try again.</p><button className="primary-button" onClick={() => this.setState({ hasError: false })}>Try again</button></section></main> : this.props.children; }
}
