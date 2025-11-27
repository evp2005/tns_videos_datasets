import React, { useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import Panel from "../../../Components/Panel";
import Completado from "../../../Components/Estados/Completado";
import { FaRegCheckCircle } from "react-icons/fa";


import {
  getTranscriptPlainText,
  getTranscriptSRT,
  getTranscriptPlainTextEIT,
  getTranscriptSRTEIT,
  getTranscriptMarkdownYT,
  getTranscriptMarkdownEIT,
} from "../services/videoTranscriptService";
import LoaderCircle from "../Components/LoaderCircle";

function TranscripcionPage() {
  const location = useLocation();
  const { video } = location.state || {};

  const [texto, setTexto] = useState("");
  const [textoSRT, setTextoSRT] = useState("");
  const [textoMarkdown, setTextoMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [stage, setStage] = useState(0);
  const [formatoSeleccionado, setFormatoSeleccionado] = useState("TXT");
  // 0 = nada
  // 1 = extracción
  // 2 = limpieza
  // 3 = alineación
  // 4 = texto final

  // === OBTENER TRANSCRIPCIÓN ===
  const prepareDataForSegmentation = () => {
    return {
      video: video,
      transcriptions: {
        txt: texto.replaceAll("<br/>", "\n"),
        srt: textoSRT.replaceAll("<br/>", "\n"),
        markdown: textoMarkdown.replaceAll("<br/>", "\n")
      }
    };
  };
  useEffect(() => {
    if (location.state?.video) {
      sessionStorage.setItem('currentVideo', JSON.stringify(location.state.video));
    }
  }, [location.state?.video]);
  const fetchTranscript = async () => {
    if (!video?.url_video) return;

    setTexto("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptPlainText(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTexto(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setStage(4);
      setTexto("❌ Error al obtener la transcripción.");
      setLoading(false);
    }
  };

  const fetchTranscriptEIT = async () => {
    if (!video?.url_video) return;

    setTexto("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptPlainTextEIT(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTexto(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setTexto("❌ Error al obtener la transcripción de EscuelaIT.");
      setLoading(false);
    }
  };

  // === OBTENER TRANSCRIPCIÓN SRT/VTT ===
  const fetchTranscriptSRTData = async () => {
    if (!video?.url_video) return;

    setTextoSRT("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptSRT(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTextoSRT(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setStage(4);
      setTextoSRT("❌ Error al obtener la transcripción SRT/VTT.");
      setLoading(false);
    }
  };

  const fetchTranscriptSRTEIT = async () => {
    if (!video?.url_video) return;

    setTextoSRT("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptSRTEIT(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTextoSRT(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setTextoSRT("❌ Error al obtener la transcripción SRT de EscuelaIT.");
      setLoading(false);
    }
  };

  const fetchTranscriptMarkdownDataYT = async () => {
    if (!video?.url_video) return;

    setTextoMarkdown("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptMarkdownYT(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTextoMarkdown(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setStage(4);
      setTextoMarkdown("❌ Error al obtener la transcripción Markdown.");
      setLoading(false);
    }
  };

  const fetchTranscriptMarkdownDataEIT = async () => {
    if (!video?.url_video) return;

    setTextoMarkdown("");
    setStage(1);
    setLoading(true);

    setTimeout(() => setStage(2), 1000);
    setTimeout(() => setStage(3), 2000);

    try {
      const res = await getTranscriptMarkdownEIT(video.url_video);
      const html = res.result.replaceAll("\n", "<br/>");

      setTimeout(() => {
        setTextoMarkdown(html);
        setStage(4);
        setLoading(false);
      }, 2800);
    } catch (e) {
      setStage(4);
      setTextoMarkdown("❌ Error al obtener la transcripción Markdown.");
      setLoading(false);
    }
  };

  // === MANEJAR CAMBIO DE FORMATO ===
  const handleFormatoChange = (formato) => {
    setFormatoSeleccionado(formato);

    if (formato === "TXT" && !texto) {
      if (video?.origin_video === "youtube") {
        fetchTranscript();
      } else if (video?.origin_video === "EscuelaIT") {
        fetchTranscriptEIT();
      }
    } else if (formato === "SRT/VTT" && !textoSRT) {
      if (video?.origin_video === "youtube") {
        fetchTranscriptSRTData();
      } else if (video?.origin_video === "EscuelaIT") {
        fetchTranscriptSRTEIT();
      }
    } else if (
      formato === "Markdown" &&
      !textoMarkdown &&
      video?.origin_video === "youtube"
    ) {
      fetchTranscriptMarkdownDataYT();
    } else if (
      formato === "Markdown" &&
      !textoMarkdown &&
      video?.origin_video === "EscuelaIT"
    ) {
      fetchTranscriptMarkdownDataEIT();
    } else {
      setStage(4);
    }
  };

  useEffect(() => {
    if (video) {
      if (video.origin_video === "youtube") {
        fetchTranscript();
      } else if (video.origin_video === "EscuelaIT") {
        fetchTranscriptEIT();
      }
    }
  }, [video]);

  return (
    <section className="flex">
      <Panel />
      <main className="flex-1 lg:ml-64">
        <div className="h-14"></div>
        <section className="bg-[#FAFAF7] border-t-2 border-solid">
          <div className="mt-6 mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-28 2xl:mx-32">
            {/* HEADER */}
            <div className="flex flex-col gap-5 mb-5">
              <h2 className="font-bold text-2xl sm:text-2xl lg:text-4xl">
                Transcripción
              </h2>
              <span className="max-w-lg text-sm sm:text-base">
                Extrae, limpia y alinea transcripciones de video
              </span>
            </div>

            {/* VIDEO INFO */}
            <section className="bg-white flex p-5 gap-24 border-2 border-[#EEEFEF] rounded-lg mb-6">
              <div>
                <div className="mb-5">
                  <h4 className="font-medium">Video a procesar</h4>
                  <span className="text-[#535353] text-sm font-medium mb-5">
                    Material seleccionado desde ingesta
                  </span>
                </div>
                <div className="w-56 h-36">
                  <img
                    className="rounded-lg h-full bg-[#D9D9D9] w-full"
                    src={video?.miniature || ""}
                    alt={video?.title || "Video"}
                  />
                </div>
              </div>

              <div className="mt-16">
                <h4 className="font-bold mb-2">
                  {video?.title || "Título del Video"}
                </h4>
                <div className="flex gap-10 mb-2">
                  <span>{video?.origin_video || "Fuente"}</span>
                  <span>{video?.duration || "Duración"}</span>
                  <span>Ingresado: {video?.uploaded_at}</span>
                </div>
                <div className="flex gap-5">
                  <span>URL</span>
                  <a
                    className="text-[#196DFF]"
                    href={video?.url_video || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {video?.url_video || "URL del video"}
                  </a>
                </div>
                <div className="mt-5 flex gap-10">
                  <a
                    className="bg-[#FAFAF7] flex items-center justify-center font-semibold h-8 w-36 rounded-md border-2 border-[#EEEFEF]"
                    href={video?.url_video || "#"}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver Original
                  </a>
                  <Link
                    to="/ingesta"
                    className="bg-[#FAFAF7] flex items-center justify-center font-semibold h-8 w-44 rounded-md border-2 border-[#EEEFEF]"
                  >
                    Cambiar video
                  </Link>
                </div>
              </div>
            </section>

            {/* PIPELINE */}
            <section className="bg-white border-2 border-[#EEEFEF] rounded-lg mb-5">
              <div className="p-5">
                <h4 className="font-semibold">Pipeline de transcripción</h4>
                <span className="text-[#AAC2CC] text-sm">
                  Proceso de extracción y limpieza
                </span>
              </div>
              <div className="px-8 2xl:px-28 flex gap-7 items-center">
                {/* Extracción */}
                <div className="flex flex-col items-center">
                  <FaRegCheckCircle
                    className={`text-5xl ${stage >= 1 ? "text-[#00CB07]" : "text-gray-300"
                      }`}
                  />
                  <span className="font-bold">Extracción</span>
                </div>

                <div
                  className={`border-b-4 ${stage >= 2 ? "border-[#3ECC72]" : "border-gray-300"
                    } w-64 2xl:w-96`}
                ></div>

                {/* Limpieza */}
                <div className="flex flex-col items-center">
                  <FaRegCheckCircle
                    className={`text-5xl ${stage >= 2 ? "text-[#00CB07]" : "text-gray-300"
                      }`}
                  />
                  <span className="font-bold">Limpieza</span>
                </div>

                <div
                  className={`border-b-4 ${stage >= 3 ? "border-[#3ECC72]" : "border-gray-300"
                    } w-64 2xl:w-96`}
                ></div>

                {/* Alineación */}
                <div className="flex flex-col items-center">
                  <FaRegCheckCircle
                    className={`text-5xl ${stage >= 3 ? "text-[#00CB07]" : "text-gray-300"
                      }`}
                  />
                  <span className="font-bold">Alineación</span>
                </div>
              </div>
            </section>

            {/* SALIDA */}
            <section className="flex">
              <div></div>

              <div className="p-5 bg-white w-[500px] 2xl:w-3/5 h-auto mb-10 border-2 border-[#EEEFEF] rounded-lg">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h4 className="font-semibold">Salida Esperada</h4>
                      <span className="text-sm text-[#AAC2CC]">
                        Vista previa de los formatos de transcripción
                      </span>
                    </div>
                  </div>

                  {/* BOTONES DE FORMATO */}
                  <div className="flex w-full gap-2 mt-4 mb-4">
                    <button
                      onClick={() => handleFormatoChange("TXT")}
                      className={`px-6 w-56 py-2 rounded-lg font-medium transition-all ${formatoSeleccionado === "TXT"
                        ? "bg-[#224DB3] text-white"
                        : "bg-[#FAFAF7] text-gray-700 border-2 border-[#EEEFEF] hover:bg-gray-100"
                        }`}
                    >
                      TXT
                    </button>
                    <button
                      onClick={() => handleFormatoChange("SRT/VTT")}
                      className={`px-6 w-56 py-2 rounded-lg font-medium transition-all ${formatoSeleccionado === "SRT/VTT"
                        ? "bg-[#224DB3] text-white"
                        : "bg-[#FAFAF7] text-gray-700 border-2 border-[#EEEFEF] hover:bg-gray-100"
                        }`}
                    >
                      SRT/VTT
                    </button>
                    <button
                      onClick={() => handleFormatoChange("Markdown")}
                      className={`px-6 w-56 py-2 rounded-lg font-medium transition-all ${formatoSeleccionado === "Markdown"
                        ? "bg-[#224DB3] text-white"
                        : "bg-[#FAFAF7] text-gray-700 border-2 border-[#EEEFEF] hover:bg-gray-100"
                        }`}
                    >
                      Markdown
                    </button>
                  </div>

                  <div className="p-3 rounded-lg border-2 border-[#EEEFEF] bg-[#FAFAF7] h-96 max-h-96 overflow-y-auto mt-5">
                    {/* Loader solo mientras esté procesando */}
                    {(stage === 1 || stage === 2 || stage === 3) && (
                      <div className="flex flex-col items-center justify-center gap-2 py-6">
                        <LoaderCircle />
                        <p className="text-sm font-medium text-gray-600">
                          {stage === 1
                            ? "Extracción…"
                            : stage === 2
                              ? "Limpieza…"
                              : "Alineación…"}
                        </p>
                      </div>
                    )}

                    {/* Texto final cuando termine */}
                    {stage === 4 && (
                      <div className="leading-relaxed text-sm font-medium text-[#333]">
                        {/* Si formato = TXT → mostrar la transcripción */}
                        {formatoSeleccionado === "TXT" && (
                          <div dangerouslySetInnerHTML={{ __html: texto }} />
                        )}

                        {/* Si formato = SRT/VTT → mostrar transcripción SRT */}
                        {formatoSeleccionado === "SRT/VTT" && (
                          <div dangerouslySetInnerHTML={{ __html: textoSRT }} />
                        )}

                        {/* Si formato = Markdown → mostrar transcripción Markdown */}
                        {formatoSeleccionado === "Markdown" && (
                          <div
                            dangerouslySetInnerHTML={{ __html: textoMarkdown }}
                          />
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-5 mt-5">
                    <button
                      className="bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF] hover:bg-[#EDEDED] transition disabled:opacity-50"
                      onClick={() => {
                        let textToCopy = texto;
                        if (formatoSeleccionado === "SRT/VTT") {
                          textToCopy = textoSRT;
                        } else if (formatoSeleccionado === "Markdown") {
                          textToCopy = textoMarkdown;
                        }
                        navigator.clipboard.writeText(
                          textToCopy.replaceAll("<br/>", "\n")
                        );
                        alert("Texto copiado al portapapeles ✅");
                      }}
                      disabled={stage !== 4}
                    >
                      Copiar
                    </button>

                    <button
                      className="bg-[#FAFAF7] rounded-lg border-2 w-28 h-8 border-[#EEEFEF] hover:bg-[#EDEDED] transition disabled:opacity-50"
                      onClick={() => {
                        let textToCopy = texto;
                        let extension = "txt";
                        if (formatoSeleccionado === "SRT/VTT") {
                          textToCopy = textoSRT;
                          extension = "srt";
                        } else if (formatoSeleccionado === "Markdown") {
                          textToCopy = textoMarkdown;
                          extension = "md";
                        }
                        const element = document.createElement("a");
                        const file = new Blob(
                          [textToCopy.replaceAll("<br/>", "\n")],
                          { type: "text/plain" }
                        );
                        element.href = URL.createObjectURL(file);
                        element.download = `transcripcion.${extension}`;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }}
                      disabled={stage !== 4}
                    >
                      Descargar
                    </button>
                  </div>
                </div>
              </div>

              {/* SIDEBAR DERECHA */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="bg-white border-2 ml-10 border-[#EEEFEF] w-[330px] 2xl:w-full gap-5 rounded-lg flex flex-col">
                    <div className="flex flex-col gap-3 p-5">
                      <h3 className="font-semibold text-lg">Siguiente paso</h3>
                      <span className="text-sm text-[#AAC2CC]">
                        Enviar material a otros módulos
                      </span>

                      <Link to="/doblaje" className="flex flex-col gap-3 px-5">
                        <button className="bg-[#224DB3] text-white flex justify-center items-center rounded-md h-8 text-sm py-1">
                          Enviar a traducción
                        </button>
                      </Link>

                      <span className="text-sm text-[#AAC2CC]">
                        Enviar el video + transcripción para traducir y doblar
                      </span>
                    </div>

                    <div className="flex flex-col gap-3 px-5 mb-5">
                      <Link
                        to="/segmentacion"
                        state={prepareDataForSegmentation()}
                      >
                        <button className="border-[#EEEFEF] border-2 rounded-lg flex justify-center items-center h-8 text-sm font-semibold py-1 w-full">
                          Enviar a segmentación
                        </button>
                      </Link>

                      <span className="text-sm text-[#AAC2CC]">
                        Enviar el video + transcripción para dividir en clips
                        temáticos
                      </span>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN */}
                <div className="bg-white border-2 ml-10 border-[#EEEFEF] w-[330px] 2xl:w-full rounded-lg flex flex-col p-5 gap-3">
                  <h4 className="font-bold">Información</h4>
                  <div className="flex justify-between">
                    <span className="text-[#AAC2CC]">Segmentos:</span>
                    <span>{video?.segments || 0}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#AAC2CC]">Duración:</span>
                    <span>{video?.duration || "0:00"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#AAC2CC]">Idioma:</span>
                    <span>{video?.language || "Desconocido"}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-[#AAC2CC]">Estado:</span>
                    <span>
                      {video?.state === "Completado" ? (
                        <Completado />
                      ) : (
                        video?.state || "Pendiente"
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </section>
  );
}

export default TranscripcionPage;
