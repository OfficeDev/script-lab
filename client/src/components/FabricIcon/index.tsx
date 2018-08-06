import * as React from 'react'

const FabricIcon = props => {
  const styles = props.size ? { fontSize: props.size } : {}
  return (
    <i className={`ms-Icon ms-Icon--${props.name}`} style={styles} aria-hidden="true" />
  )
}
export default FabricIcon
