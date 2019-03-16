import * as React from 'react';

interface Props {
  onClick: any;
  className?: string;
  html?: string
}

export default class Button extends React.Component<Props> {
  render() {
    if (this.props.html) {
      return <button
        className={this.props.className}
        onClick={this.onClick}
        dangerouslySetInnerHTML={{ __html: this.props.html }}>
        {this.props.children}</button>
    } else {
      return <button
        className={this.props.className}
        onClick={this.onClick}>
        {this.props.children}</ button>
    }

  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}