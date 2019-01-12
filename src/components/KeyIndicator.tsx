import React from "react";

interface Props {
  keyName: string
}

export default class KeyIndicator extends React.Component<Props> {
  render() {
    return <div>
      {this.props.keyName}
    </div>
  }
}