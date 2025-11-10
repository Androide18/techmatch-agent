"use client";

import z from "zod";
import { profileSchema } from "../api/search/schema";
import { TechMatchInput } from "../features/TechMatchInput";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { useState } from "react";
import { ProfileCard } from "./components/profile-card";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "motion/react";
import { InfoCard } from "./components/info-card";
import {
  hidden,
  list,
  profileList,
  springTransition,
  visible,
} from "./animations";
import { information } from "./constants";
import { cn } from "@/lib/utils";
import { ProfileCardSkeleton } from "./components/profile-card-skeleton";
import { Loader2 } from "lucide-react";
import { TokenConsole } from "./components/token-console";

export default function Home() {
  const [requestFinished, setRequestFinished] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [tokensUsed, setTokensUsed] = useState(null);

  const { isLoading, object, clear, submit, stop } = useObject({
    api: "/api/search",
    schema: z.array(profileSchema),
    onFinish: () => {
      setRequestFinished(true);
    },
  });

  const hasItems = object && object.length > 0;

  const handleNewSearch = () => {
    setRequestFinished(false);
    clear();
  };

  const handleSubmit = async (input: string | FormData) => {
    setRequestFinished(false);
    setErrorMessage(null);

    // Case 1: user typed text
    if (typeof input === "string") {
      submit({ input });
      return;
    }

    // Case 2: user uploaded a PDF
    if (input instanceof FormData) {
      try {
        setPdfLoading(true);

        const pdfResponse = await fetch("/api/pdf-to-text", {
          method: "POST",
          body: input,
        });

        if (!pdfResponse.ok) {
          const errorData = await pdfResponse.json().catch(() => null);

          if (errorData?.reason) {
            setErrorMessage(errorData.reason);
          } else {
            setErrorMessage("Error procesando el archivo PDF.");
          }

          console.error("PDF-to-text failed:", errorData);
          return;
        }

        const { text, tokens } = await pdfResponse.json();
        console.log("RES TOKENS:", tokens);
        console.log("Extracted PDF text:", text.slice(0, 200));

        setTokensUsed(tokens);
        submit({ input: text });
      } catch (err) {
        console.error("Error processing PDF:", err);
        setErrorMessage("Error procesando el archivo PDF.");
      } finally {
        setPdfLoading(false); //
      }
    }
  };

  const loading = isLoading || pdfLoading;

  return (
    <main className="py-6 px-4 gap-10 max-w-7xl mx-auto flex flex-col h-dvh relative">
      {/* Hero Section */}
      <nav className="flex justify-between items-center w-full">
        <div>
          <h1 className="md:text-3xl text-2xl font-extrabold sirius-gradient inline-block bg-clip-text text-transparent font-inter tracking-tight">
            TechMatch Bot
          </h1>
          <h2 className="text-gray-400">
            Agente de Asignación Inteligente de Recursos Técnicos
          </h2>
        </div>

        {hasItems && (
          <div className="flex items-center gap-10">
            {loading && (
              <span className="flex items-center gap-2 text-gray-400">
                Evaluando Perfiles <Loader2 className="animate-spin" />
              </span>
            )}
            <Button disabled={loading} onClick={handleNewSearch}>
              Realizar otra búsqueda
            </Button>
          </div>
        )}
      </nav>

      <motion.section
        layout
        style={{ justifyContent: requestFinished ? "flex-start" : "center" }}
        className="flex-1 z-10 justify-center items-center gap-52 flex flex-col relative"
      >
        <AnimatePresence>
          {!requestFinished && !loading && (
            <div className="flex-1 min-h-42 justify-end max-w-4xl text-center flex flex-col gap-2">
              <motion.h3
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={springTransition()}
                className="text-3xl font-semibold text-balance selection:bg-primary selection:text-white"
              >
                Busca el perfil justo para ese puesto
              </motion.h3>
              <motion.p
                initial={{ y: 70, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -70, opacity: 0 }}
                transition={springTransition(0.1)}
                className="text-balance text-gray-400 leading-relaxed selection:bg-secondary-1 selection:text-black"
              >
                Optimiza la asignación de desarrolladores a proyectos usando IA.
                Analiza habilidades, experiencia previa y disponibilidad para
                ofrecerte el mejor match automáticamente.
              </motion.p>
            </div>
          )}
        </AnimatePresence>

        {hasItems && (
          <motion.div
            variants={profileList}
            initial="hidden"
            animate="visible"
            exit="hidden"
            layout
            className="w-full max-w-5xl flex flex-col gap-10"
          >
            {object?.map((item, index) => (
              // @ts-expect-error profile is good
              <ProfileCard key={`${ item?.id || item?.fullName?.trim() || "profile"}-${index}`} profile={item} /> 
            ))}

            {!requestFinished && <ProfileCardSkeleton />}
          </motion.div>
        )}

        {!requestFinished && (
          <div className="relative w-full h-full">
            <AnimatePresence>
              {!hasItems && (
                <motion.div
                  key="input"
                  className="w-full absolute bottom-[110%] left-1/2 -translate-x-1/2 z-20"
                  transition={springTransition(isLoading ? 0.4 : 0)}
                  variants={{ visible, hidden }}
                  initial="hidden"
                  animate={{
                    opacity: 1,
                    y: loading ? 100 : 0,
                    ...(loading && { bottom: 120 }),
                  }}
                  exit={{
                    opacity: 0,
                    y: 100,
                    transition: {
                      duration: 0.25,
                      ease: "easeOut",
                    },
                  }}
                >
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-red-500 text-sm font-medium text-center mb-3"
                    >
                      {errorMessage}
                    </motion.div>
                  )}
                  <TechMatchInput
                    onSubmit={handleSubmit}
                    isLoading={loading}
                    onStop={stop}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {!loading && (
                <motion.div
                  variants={list}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ delay: 0.3 }}
                  className="flex gap-4"
                >
                  {information.map((card) => (
                    <InfoCard
                      key={card.id}
                      title={card.title}
                      description={card.description}
                      color={card.color}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </motion.section>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1.0 }}
        transition={{ delay: 0.95, duration: 1, ease: "easeOut" }}
        className={cn(
          "absolute top-60 -translate-x-1/2 left-1/2 flex flex-col items-center w-full"
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          className="-z-10 mask-b-from-50% mask-t-from-50% mask-l-from-50% mask-r-from-50% transition duration-500"
        >
          <img
            src="./sirius-logo.svg"
            className={cn(
              "w-96 h-96 transition-all duration-500",
              loading &&
                !hasItems &&
                "w-40 h-40 animate-[spin_2s_linear_infinite_200ms]"
            )}
          />
        </motion.div>
        <AnimatePresence>
          {loading && !hasItems && (
            <motion.p
              transition={{ delay: 0.5, type: "spring", bounce: 0.25 }}
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 0.8, y: 0 }}
              exit={{ opacity: 0, y: 100, transition: { delay: 0.0 } }}
              className="z-40 text-xl absolute left-1/2 -translate-x-1/2 -bottom-10 tracking-wide bg-linear-to-br from-primary to-lime-200 bg-clip-text text-transparent  whitespace-nowrap"
            >
              Evaluando perfiles
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
      <TokenConsole tokensUsed={tokensUsed} />
    </main>
  );
}
