export default interface IMenuItem {
  key: string
  label?: string
  icon: string
  onClick: () => void
  ariaLabel?: string
}
