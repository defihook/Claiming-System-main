import { FORTNIGHT_LENGTH } from "../config";

export default function Progressbar(props: { days: number }) {
  return (
    <div className="day-progress">
      <div
        className="day-line"
        style={{ width: `calc(${(props.days / FORTNIGHT_LENGTH) * 100}%)` }}
      >
        {props.days > 0 && <span>{((props.days / FORTNIGHT_LENGTH) * 100).toFixed(0)}%</span>}
      </div>
    </div>
  );
}
