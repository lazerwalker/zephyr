import * as React from 'react';

interface Props {
  onClick: any;
  className?: string;
}

export default class Button extends React.Component<Props> {
  render() {
    return <button className={this.props.className} onClick={this.onClick}>{this.props.children}</button>
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}