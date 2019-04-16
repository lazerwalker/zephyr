import * as React from 'react'
import Arrow, { ArrowDirection } from './Arrow';

interface Props {
  onExit: any; // lol, how do I declare a (void -> void)
}

export default class CreditView extends React.Component<Props> {
  render() {
    const people = [
      "adina shanholtz",
      "alan hazelden",
      "alexei pepers",
      "ali cedroni",
      "chris smith",
      "douglas pennant",
      "gwen guo",
      "jacob vander ende",
      "jerry belich",
      "joe bunda",
      "jordan orelli",
      "josie brechner",
      "keir miron",
      "kristi anderson",
      "leene künnap",
      "len predko",
      "maize wallin",
      "nic plum",
      "robbie fraser",
      "robin baumgarten",
      "tyler samson",
    ].map(p => {
      return <li key={p}>{p}</li>
    })

    return (
      <div className='credits'>
        <h1>ａｃｔｏｒｓ</h1>
        <ul>
          {people}
        </ul>

        <Arrow onClick={this.props.onExit} direction={ArrowDirection.Down} />

      </div>
    )
  }
}

