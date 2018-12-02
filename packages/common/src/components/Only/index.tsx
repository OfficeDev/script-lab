export interface IProps {
  when: boolean;
  children: React.ReactNode;
}

export default ({ when, children }: IProps) => (when ? children : null);
