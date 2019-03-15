import * as React from 'react';

interface Props {
  onClick: any;
}

export default class Button extends React.Component<Props> {
  render() {
    return <button onClick={this.onClick}>{this.props.children}</button>
  }

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick()
    }
  }
}