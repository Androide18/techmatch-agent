import { TechMatchInput } from "./features/TechMatchInput";

export default function Home() {
  return (
    <main className="bg-bg text-white min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <section className="text-center max-w-3xl">
        <h1
          className="
            text-5xl md:text-6xl font-extrabold mb-4 sirius-gradient inline-block bg-clip-text text-transparent"
        >
          TechMatch Bot
        </h1>
        <h2 className="text-2xl md:text-xl mb-8 font-light">
          Agente de Asignación Inteligente de Recursos Técnicos
        </h2>

        <p className="text-md md:text-md mb-10 leading-relaxed">
          Optimiza la asignación de desarrolladores a proyectos usando IA.
          Analiza habilidades, experiencia previa y disponibilidad para
          ofrecerte el mejor match automáticamente.
        </p>

        {/* Input feature */}
        <div className="w-full flex justify-center">
          <TechMatchInput />
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 max-w-5xl grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 rounded-sm bg-bg border border-[rgba(255,255,255,0.1)] backdrop-blur-md shadow-[0_0_15px_var(--color-dark-blue-shadow)]">
          <h3 className="text-xl font-semibold text-secondary-1 mb-2">
            Asignación Inteligente
          </h3>
          <p className="text-white text-sm">
            Encuentra automáticamente el mejor candidato para cada proyecto
            según skills, experiencia y carga actual.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-bg border border-[rgba(255,255,255,0.1)] backdrop-blur-md shadow-[0_0_15px_var(--color-dark-blue-shadow)]">
          <h3 className="text-xl font-semibold text-secondary-2 mb-2">
            Scoring Dinámico
          </h3>
          <p className="text-white text-sm">
            Calcula un score de compatibilidad para priorizar candidatos según
            experiencia real y afinidad tecnológica.
          </p>
        </div>

        <div className="p-6 rounded-sm bg-bg border border-[rgba(255,255,255,0.1)] backdrop-blur-md shadow-[0_0_15px_var(--color-dark-blue-shadow)]">
          <h3 className="text-xl font-semibold text-secondary-3 mb-2">
            Decisiones Basadas en Datos
          </h3>
          <p className="text-white text-sm">
            Reduce el sesgo manual y toma decisiones más rápidas y precisas con
            evidencia del historial de proyectos.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-24 text-center text-sm text-white">
        <p>
          © {new Date().getFullYear()} <span className="text-main-light-blue font-semibold">TechMatch Bot</span> — Hecho con 💙 para optimizar tu equipo técnico.
        </p>
      </footer>
    </main>
  );
}
