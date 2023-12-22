export default function Toolbar({
  lineWidth,
  setLineWidth,
  strokeStyle,
  setStrokeStyle,
}) {
  return (
    <div>
      <div>
        <label htmlFor="lineWidth">Grosor del pincel: </label>
        <input
          id="lineWidth"
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="strokeStyle">Color del pincel: </label>
        <input
          id="strokeStyle"
          type="color"
          value={strokeStyle}
          onChange={(e) => setStrokeStyle(e.target.value)}
        />
      </div>
    </div>
  );
}
