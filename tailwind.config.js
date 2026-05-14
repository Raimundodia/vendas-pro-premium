@tailwind base;
@tailwind components;
@tailwind utilities;

/* Estilos Globais Personalizados para o VendasPRO */
body {
  @apply bg-[#0f0f1a] text-[#f1f5f9];
  font-family: 'Inter', sans-serif;
}

/* Customização de scrollbar para um visual moderno */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0f0f1a;
}

::-webkit-scrollbar-thumb {
  background: #2d2d5e;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #7c3aed;
}
