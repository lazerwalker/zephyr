import * as React from 'react'

interface Props {
  file: String
}

export default (props: Props): React.ReactElement<Props> => {
  return (
    <video autoPlay loop muted playsInline>
      <source src={`cinemagraphs/${props.file}.webm`} type="video/webm" />
      <source src={`cinemagraphs/${props.file}.mov`} type="video/mp4" />
    </video>
  )
}