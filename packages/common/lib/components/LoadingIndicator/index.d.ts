/// <reference types="react" />
export interface IProps {
    numBalls: number;
    ballSize: number;
    ballColor: string;
    delay?: number;
}
declare const LoadingIndicator: ({ numBalls, ballSize, ballColor, delay }: IProps) => JSX.Element;
export default LoadingIndicator;
