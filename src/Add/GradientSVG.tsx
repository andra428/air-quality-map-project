interface GradientSVGProps {
  id: string;
  value: number;
  max: number;
}

export default function GradientSVG({ id, value, max }: GradientSVGProps) {
  const ratio = value / max;
  let color1 = "";
  let color2 = "";
  if (ratio <= 0.8) {
    color1 = "#3E8525";
    color2 = "#aadf7cff";
  } else if (ratio > 0.8 && ratio <= 1.0) {
    color1 = "#FFA500";
    color2 = "#ff9900ff";
  } else {
    color1 = "#ff9900ff";
    color2 = "#ba0000ff";
  }

  return (
    <svg style={{ height: 0 }}>
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
    </svg>
  );
}
