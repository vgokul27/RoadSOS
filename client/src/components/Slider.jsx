export default function Slider({
  value = [0],
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  className = '',
}) {
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onValueChange([newValue]);
  };

  const percentage = ((value[0] - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full ${className}`}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value[0]}
        onChange={handleChange}
        className="w-full h-2 appearance-none bg-gray-700 rounded-full cursor-pointer accent-red-500"
        style={{
          background: `linear-gradient(to right, hsl(0 85% 55%) 0%, hsl(0 85% 55%) ${percentage}%, rgba(55, 65, 81, 0.5) ${percentage}%, rgba(55, 65, 81, 0.5) 100%)`,
        }}
      />
    </div>
  );
}
