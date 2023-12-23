export default function Toolbar({ isTracing, setIsTracing }) {
  return (
    <div>
      <button onClick={() => setIsTracing(!isTracing)}>
        {isTracing ? 'Detener Trazado' : 'Iniciar Trazado'}
      </button>
    </div>
  );
}
