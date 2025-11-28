import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Panel from "../../../Components/Panel";
import { FaArrowLeft } from "react-icons/fa";
import { LuSparkles } from "react-icons/lu";
import { Select, Table } from "antd";

function SegmentacionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { video, transcriptions } = location.state || {};

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [numeroSegmentos, setNumeroSegmentos] = useState(""); // Estado inicial vacío
  const [segmentos, setSegmentos] = useState([]);
  const [segmentosMostrados, setSegmentosMostrados] = useState([]);
  // 🔥 1. AÑADIR ESTADOS DE CARGA Y ERROR
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔥 FUNCIÓN PARA EXTRAER CAPÍTULOS DEL MARKDOWN
  const extraerCapitulosDeMarkdown = (markdownText) => {
    if (!markdownText) return [];

    const lineas = markdownText.split("\n");
    const capitulos = [];
    let numeroCapitulo = 0;

    lineas.forEach((linea, index) => {
      // Buscar líneas que contienen "**Capítulo X:"
      const capituloMatch = linea.match(/\*\*Capítulo\s+(\d+):\s*(.+?)\*\*/);

      if (capituloMatch) {
        numeroCapitulo++;
        const titulo = capituloMatch[2].trim();

        // Buscar inicio y fin en las siguientes líneas
        let inicio = "";
        let fin = "";
        let importancia = "N/A"; // Valor por defecto

        for (let i = index + 1; i < Math.min(index + 5, lineas.length); i++) {
          const siguienteLinea = lineas[i].trim();

          // Buscar **Inicio:** 00:00:00.000
          const inicioMatch = siguienteLinea.match(
            /\*\*Inicio:\*\*\s*(\d{2}:\d{2}:\d{2}\.\d{3})/
          );
          if (inicioMatch) {
            inicio = inicioMatch[1]; // Guardamos el tiempo completo con milisegundos
          }

          // Buscar **Final:** 00:00:00.000
          const finMatch = siguienteLinea.match(
            /\*\*Final:\*\*\s*(\d{2}:\d{2}:\d{2}\.\d{3})/
          );
          if (finMatch) {
            fin = finMatch[1]; // Guardamos el tiempo completo con milisegundos
          }

          // --- CORRECCIÓN: Añadir lógica para extraer la importancia ---
          // Busca "Importancia" (insensible a mayúsculas) y permite espacios flexibles.
          const importanciaMatch = siguienteLinea.match(
            /\*\*Importancia\s*:\*\*\s*(.+)/i
          );
          if (importanciaMatch) {
            importancia = importanciaMatch[1].trim();
          }
        }

        capitulos.push({
          key: numeroCapitulo - 1,
          numero: numeroCapitulo,
          tema: titulo,
          inicio: inicio || "00:00:00.000",
          fin: fin || "00:00:00.000",
          importancia: importancia, // Añadimos la importancia al objeto del capítulo
        });
      }
    });

    return capitulos;
  };

  // 🔥 EXTRAER CAPÍTULOS AL CARGAR
  useEffect(() => {
    if (transcriptions?.markdown) {
      const capitulosExtraidos = extraerCapitulosDeMarkdown(
        transcriptions.markdown
      );
      setSegmentos(capitulosExtraidos);

      // --- CORRECCIÓN: Establecer "Todos" como valor por defecto ---
      setNumeroSegmentos(String(capitulosExtraidos.length));

      // Seleccionar todos por defecto
      setSelectedRowKeys(capitulosExtraidos.map((s) => s.key));
    }
  }, [transcriptions?.markdown]);

  // Actualizar segmentos mostrados cuando cambie el número
  useEffect(() => {
    const cantidad = parseInt(numeroSegmentos);
    const mostrar = segmentos.slice(0, cantidad);
    setSegmentosMostrados(mostrar);
  }, [numeroSegmentos, segmentos]);

  const handleNumeroSegmentosChange = (value) => {
    setNumeroSegmentos(value);
    const maxKey = parseInt(value);
    setSelectedRowKeys((prev) => prev.filter((key) => key < maxKey));
  };

  // Función para volver a transcripción
  const handleVolverTranscripcion = () => {
    navigate("/transcripcion", { state: { video } });
  };

  // 🔥 2. FUNCIÓN PARA LLAMAR AL BACKEND Y GENERAR CLIPS
  const handleGenerarClips = async () => {
    if (selectedRowKeys.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      // 🔥 3. PREPARAR LOS DATOS PARA LA API
      const segmentosSeleccionados = segmentos
        .filter((s) => selectedRowKeys.includes(s.key))
        .map((s) => ({
          title: s.tema,
          start: s.inicio,
          end: s.fin,
        }));

      // --- INICIO DE LA DEPURACIÓN ---
      // 1. Imprime el objeto 'video' para ver qué propiedades tiene realmente.
      console.log("DEBUG: Objeto 'video' recibido:", video);
      // 2. Imprime el objeto 'transcriptions' para encontrar la URL.
      console.log("DEBUG: Objeto 'transcriptions' recibido:", transcriptions);

      // --- CORRECCIÓN ---
      // La URL original del video está en el objeto 'transcriptions', pero
      // probablemente con un nombre como 'video_url' o 'original_url'.
      // Revisa la consola del navegador para ver el nombre correcto y ajústalo aquí.
      // --- CORRECCIÓN FINAL ---
      // La URL original está en el objeto 'video' con la propiedad 'url_video'.
      const videoUrl = video.url_video;

      const payload = {
        url: videoUrl, // <-- CORRECCIÓN: Usamos la URL que acabamos de definir.
        video_title: video.title, // El backend espera 'video_title', no 'title'.
        segments: segmentosSeleccionados,
      };

      // --- FIN DE LA DEPURACIÓN ---
      const API_BASE_URL =
        import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
      const endpoint =
        video.origin_video === "youtube"
          ? `${API_BASE_URL}/agent/segment-video-youtube`
          : `${API_BASE_URL}/agent/segment-video-escuelait`;

      console.log(`Enviando petición a: ${endpoint}`);
      console.log("DEBUG: Payload enviado:", JSON.stringify(payload, null, 2));

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // Intenta obtener el detalle del error del backend para un mejor diagnóstico.
        let errorDetail = "Ocurrió un error en el servidor.";
        try {
          const errorData = await response.json();
          // DRF a menudo devuelve errores en un objeto, ej: {"video_url": ["Este campo no puede ser nulo."]}
          errorDetail = errorData.detail || JSON.stringify(errorData);
        } catch (e) {
          // Si la respuesta de error no es JSON, usa el texto de estado.
          errorDetail = response.statusText;
        }
        throw new Error(errorDetail);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${video.title || "clips"}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      // Si es un error de red (como CORS), err.message será más descriptivo
      console.error("Error al generar clips:", err);
      setError(
        err.message ||
          "No se pudo conectar con el servidor. Revisa la consola para más detalles."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "numero",
      key: "numero",
      width: 60,
      align: "center",
      render: (
        text // Mostramos solo HH:MM:SS en la tabla para que sea más limpio
      ) => <span className="text-sm text-gray-900 font-medium">{text}</span>,
    },
    {
      title: "Tema",
      dataIndex: "tema",
      key: "tema",
      width: "50%",
      render: (text) => (
        <span className="text-sm text-gray-900 font-medium">{text}</span>
      ),
    },
    {
      title: "Inicio",
      dataIndex: "inicio",
      key: "inicio",
      width: "15%",
      align: "center",
      render: (text) => (
        <span className="text-sm text-gray-700 font-mono font-medium">
          {text.substring(0, 8)}
        </span>
      ),
    },
    {
      title: "Fin",
      dataIndex: "fin",
      key: "fin",
      width: "15%",
      align: "center",
      render: (text) => (
        <span className="text-sm text-gray-700 font-mono font-medium">
          {text.substring(0, 8)}
        </span>
      ),
    },
    {
      title: "Importancia",
      dataIndex: "importancia",
      key: "importancia",
      width: "15%",
      align: "center",
      render: (importancia) => {
        // --- CORRECCIÓN: Añadir comprobación de seguridad ---
        if (!importancia || typeof importancia !== "string") {
          importancia = "N/A"; // Asignar valor por defecto si no es un string válido
        }

        let color = "gray";
        const importanciaLower = importancia.toLowerCase();

        if (importanciaLower === "alta") {
          color = "green";
        } else if (importanciaLower === "media") {
          color = "orange";
        } else if (importanciaLower === "baja") {
          color = "red";
        }

        return (
          <span
            className={`px-2 py-1 text-xs font-semibold rounded-full bg-${color}-100 text-${color}-800 border border-${color}-200`}
          >
            {importancia}
          </span>
        );
      },
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      name: record.tema,
    }),
  };

  // --- INICIO DE LA MEJORA ---
  // Función para generar opciones dinámicas para el selector
  const generarOpcionesDeSegmentos = (totalSegmentos) => {
    if (totalSegmentos <= 5) {
      // Si hay muy pocos, solo mostrar la opción de "Todos"
      return [
        { value: String(totalSegmentos), label: `Todos (${totalSegmentos})` },
      ];
    }

    const opciones = [];
    const escalones = [4, 8, 12, 20]; // Escalones predefinidos

    // Añadir escalones que sean menores que el total
    for (const escalon of escalones) {
      if (escalon < totalSegmentos) {
        opciones.push({
          value: String(escalon),
          label: `${escalon} Capítulos`,
        });
      }
    }

    // Añadir siempre la opción de "Todos"
    opciones.push({
      value: String(totalSegmentos),
      label: `Todos (${totalSegmentos})`,
    });

    return opciones;
  };
  // --- FIN DE LA MEJORA ---

  const estadisticas = {
    seleccionados: selectedRowKeys.length,
  };

  return (
    <section className="flex h-screen overflow-hidden">
      <Panel />
      <main className="flex-1 ml-0 lg:ml-64 flex flex-col">
        <div className="h-14 bg-white border-b-2 border-gray-200"></div>

        <section className="flex-1 bg-[#FAFAF7] overflow-y-auto">
          <div className="flex justify-center p-8">
            <div className="w-full max-w-7xl">
              {/* Header */}
              <div className="mb-8">
                <h1 className="font-bold text-3xl text-gray-900 mb-2">
                  Dataset Transcripción
                </h1>
                <p className="text-gray-600">
                  Divide videos largos en clips temáticos basados en el índice
                  del contenido
                </p>
              </div>

              {/* Material a Segmentar */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      Material a Segmentar
                    </h2>
                    <p className="text-gray-600">
                      Video y transcripción recibidos desde Transcripción
                    </p>
                  </div>
                  <button
                    onClick={handleVolverTranscripcion}
                    className="flex items-center gap-3 px-5 py-1 border-2 border-[#EEEFEF] bg-[#FAFAF7] text-[#333333] hover:bg-[#f0f0f0] rounded-lg transition-colors text-sm font-medium"
                  >
                    <FaArrowLeft className="text-sm" />
                    Volver a Transcripción
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                  {/* Video Original */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-6">
                      Video Original
                    </h3>
                    <div className="bg-[#D9D9D9] rounded-lg h-44 mb-6 overflow-hidden">
                      {video?.miniature ? (
                        <img
                          src={video.miniature}
                          alt={video.title || "Video thumbnail"}
                          className="w-full h-full object-cover"
                        />
                      ) : null}
                    </div>
                    <p className="text-gray-900 font-medium mb-3">
                      {video?.title || "Sin título"}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {video?.origin_video || "Fuente desconocida"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-gray-400 flex items-center justify-center">
                          <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {video?.duration || "00:00"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Transcripción Original */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-6">
                      Transcripción Original
                    </h3>
                    <div className="border border-gray-200 rounded-lg p-6 mb-6 bg-gray-50 h-44 flex flex-col justify-center">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Formato:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            Markdown
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Idioma:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {video?.language || "Español"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Capítulos:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {segmentos.length}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">
                            Generado:
                          </span>
                          <span className="text-gray-900 font-semibold">
                            {video?.uploaded_at || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="w-full py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
                      Ver Transcripción completa
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Índice Temático */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="flex items-center gap-2 mb-6">
                      <LuSparkles className="text-blue-600 text-xl" />
                      <h3 className="text-xl font-semibold text-gray-900">
                        Índice Temático (Markdown)
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Capítulos extraídos automáticamente de la transcripción en
                      formato Markdown
                      {video && (
                        <span className="ml-2 text-blue-600 text-xs">
                          (Video ID: {video.id || video.video_id})
                        </span>
                      )}
                    </p>

                    {/* Mostrar si no hay Markdown */}
                    {!transcriptions?.markdown ? (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <p className="text-yellow-800">
                          ⚠️ No hay transcripción en formato Markdown
                          disponible. Por favor, genera la transcripción en
                          Markdown desde la página de Transcripción.
                        </p>
                      </div>
                    ) : segmentos.length === 0 ? (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-blue-800">
                          ℹ️ No se encontraron capítulos en el Markdown.
                          Asegúrate de que la transcripción tenga el formato
                          correcto con **Capítulo X:**
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-4 mb-6">
                          <span className="text-sm font-medium text-gray-900">
                            Mostrar primeros:
                          </span>
                          <Select
                            value={numeroSegmentos}
                            onChange={handleNumeroSegmentosChange}
                            style={{ width: 140 }}
                            options={generarOpcionesDeSegmentos(
                              segmentos.length
                            )}
                          />
                          <span className="text-sm text-gray-500">
                            ({selectedRowKeys.length} Seleccionados)
                          </span>
                        </div>

                        {/* Tabla de Segmentos */}
                        <Table
                          rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                            hideSelectAll: true,
                          }}
                          columns={columns}
                          dataSource={segmentosMostrados}
                          pagination={false}
                          size="middle"
                          className="segments-table"
                          rowClassName="segment-row"
                        />

                        {/* Sugerencia */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-sm text-blue-800">
                            Los capítulos se extrajeron automáticamente del
                            Markdown. Puedes seleccionar los que desees para
                            generar clips individuales.
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Panel de Acciones y Estadísticas */}
                <div className="space-y-6">
                  {/* Acciones */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Acciones
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Generar segmentos
                    </p>

                    <div className="space-y-3">
                      <button
                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleGenerarClips}
                        disabled={selectedRowKeys.length === 0 || isLoading}
                      >
                        {isLoading
                          ? "Generando..."
                          : `Generar ${selectedRowKeys.length} Clips`}
                      </button>
                      {error && (
                        <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded-lg text-center">
                          <p className="text-sm text-red-700">
                            <strong>Error:</strong> {error}
                          </p>
                        </div>
                      )}
                      <button
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                        onClick={() =>
                          setSelectedRowKeys(
                            segmentosMostrados.map((s) => s.key)
                          )
                        }
                      >
                        Seleccionar Todos
                      </button>
                      <button
                        className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
                        onClick={() => setSelectedRowKeys([])}
                      >
                        Limpiar Selección
                      </button>
                    </div>
                  </div>

                  {/* Estadísticas */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Estadísticas
                    </h3>

                    <div className="space-y-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Capítulos totales:
                        </span>
                        <span className="font-medium">{segmentos.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Seleccionados:</span>
                        <span className="font-medium text-blue-600">
                          {estadisticas.seleccionados}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duración total:</span>
                        <span className="font-medium">
                          {video?.duration || "00:00"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview del Markdown (opcional) */}
              {transcriptions?.markdown && (
                <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h4 className="font-semibold mb-4 text-gray-900">
                    Preview de la Transcripción Markdown
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-gray-200">
                    <pre className="text-sm whitespace-pre-wrap text-gray-700">
                      {transcriptions.markdown.substring(0, 2000)}
                      {transcriptions.markdown.length > 2000 && "..."}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </section>
  );
}

export default SegmentacionPage;
