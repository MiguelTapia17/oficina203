import { useEffect, useMemo, useRef, useState } from "react";
import { apiGet } from "../services/api";
import { SVG } from "../assets/imgSvg";
import Chart from "react-apexcharts";
import "../styles/inicio.css";

export default function Inicio() {
  // Cards (números)
  const [totalMateriales, setTotalMateriales] = useState(0);
  const [productosPorAcabarse, setProductosPorAcabarse] = useState(0);

  // Listas
  const [sinStock, setSinStock] = useState([]); // [{id_item, nombre_item, nombre_sede}, ...]
  const [sedes, setSedes] = useState([]); // [{id_sede, nombre_sede, total_materiales}, ...]

  // Filtro y selección (sin stock)
  const [selectedSede, setSelectedSede] = useState(""); // "" = Todas
  const [selectedItem, setSelectedItem] = useState(""); // nombre_item seleccionado

  // CHART (materiales por sede)
  const chartWrapRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (!chartWrapRef.current) return;

    const ro = new ResizeObserver((entries) => {
      const h = entries[0]?.contentRect?.height || 300;
      setChartHeight(Math.max(200, Math.floor(h)));
    });

    ro.observe(chartWrapRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [resTotal, resPorAcabarse, resSinStock, resPorSede] =
          await Promise.all([
            apiGet("dashboard/total-materiales"),
            apiGet("dashboard/productos-por-acabarse"),
            apiGet("dashboard/productos-sin-stock"),
            apiGet("dashboard/materiales-por-sede"),
          ]);

        // total-materiales => { data: { total_materiales: "9790.00" } }
        setTotalMateriales(parseFloat(resTotal?.data?.total_materiales || 0));

        // productos-por-acabarse => soporta varias formas comunes
        const porAcabarse =
          resPorAcabarse?.data?.total_productos ??
          resPorAcabarse?.data?.productos_por_acabarse ??
          resPorAcabarse?.data?.total ??
          0;

        setProductosPorAcabarse(parseFloat(porAcabarse || 0));

        // productos-sin-stock => { data: [ ... ] }
        setSinStock(Array.isArray(resSinStock?.data) ? resSinStock.data : []);

        // materiales-por-sede => { data: { total_sedes, sedes: [...] } }
        setSedes(
          Array.isArray(resPorSede?.data?.sedes) ? resPorSede.data.sedes : []
        );
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchDashboard();
  }, []);

  // Si cambia sede, limpiamos selección de producto
  useEffect(() => {
    setSelectedItem("");
  }, [selectedSede]);

  // ====== CHART: Materiales por sede (ApexCharts) ======
  const chartCategorias = useMemo(
    () => sedes.map((s) => s.nombre_sede),
    [sedes]
  );

  const chartSeries = useMemo(
    () => [
      {
        name: "Materiales",
        data: sedes.map((s) => Number.parseFloat(s.total_materiales || 0)),
      },
    ],
    [sedes]
  );

  const chartOptions = useMemo(
    () => ({
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      colors: ["#FF0C29"], // color de barras
      plotOptions: {
        bar: {
          borderRadius: 8,
          columnWidth: "55%",
        },
      },
      dataLabels: { enabled: false },
      grid: {
        borderColor: "rgba(0,0,0,0.25)",
        strokeDashArray: 4,
        padding: { left: 8, right: 8 },
      },
      xaxis: {
        categories: chartCategorias,
        labels: {
          rotate: -20,
          trim: true,
          hideOverlappingLabels: true,
          style: { fontSize: "12px" },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: {
        labels: {
          formatter: (val) => `${Math.round(val)}`,
        },
      },
      tooltip: {
        theme: "light",
        y: { formatter: (val) => `${val} und.` },
      },
    }),
    [chartCategorias]
  );

  // ====== Select: sedes únicas desde sinStock ======
  const sedesSinStock = useMemo(() => {
    const set = new Set(sinStock.map((x) => x?.nombre_sede).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sinStock]);

  // ====== Filtrado de sinStock por sede ======
  const sinStockFiltrado = useMemo(() => {
    if (!selectedSede) return sinStock;
    return sinStock.filter((x) => x?.nombre_sede === selectedSede);
  }, [sinStock, selectedSede]);

  // ====== AGRUPACIÓN: Sin stock por producto ======
  const sinStockGrouped = useMemo(() => {
    const map = new Map();

    for (const row of sinStockFiltrado) {
      const nombre = row?.nombre_item || "Sin nombre";
      const sede = row?.nombre_sede || "Sin sede";

      if (!map.has(nombre)) {
        map.set(nombre, { nombre_item: nombre, total: 0, sedes: new Set() });
      }

      const item = map.get(nombre);
      item.total += 1;
      item.sedes.add(sede);
    }

    return Array.from(map.values())
      .map((x) => ({
        nombre_item: x.nombre_item,
        total: x.total,
        sedes: Array.from(x.sedes),
        total_sedes_unicas: x.sedes.size,
      }))
      .sort((a, b) => b.total - a.total);
  }, [sinStockFiltrado]);

  // ====== Donut Sin stock por producto (Top + Otros) ======
  const donutTopN = 6;

  const donutData = useMemo(() => {
    const top = sinStockGrouped.slice(0, donutTopN);
    const rest = sinStockGrouped.slice(donutTopN);

    const labels = top.map((x) => x.nombre_item);
    const series = top.map((x) => x.total_sedes_unicas);

    const otros = rest.reduce((acc, x) => acc + x.total_sedes_unicas, 0);
    if (otros > 0) {
      labels.push("Otros");
      series.push(otros);
    }

    return { labels, series };
  }, [sinStockGrouped]);

  const donutOptions = useMemo(
  () => ({
    chart: {
      type: "donut",
      toolbar: { show: false },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const idx = config.dataPointIndex;
          const label = donutData.labels[idx];

          if (label === "Otros") {
            setSelectedItem("");
            return;
          }
          setSelectedItem(label);
        },
      },
    },
    labels: donutData.labels,
    legend: {
      position: "bottom",
      fontSize: "12px",
    },
    dataLabels: { enabled: false },
    tooltip: {
      y: {
        formatter: (val) => {
          const n = Number(val) || 0;
          const label = selectedSede ? "producto" : "sede";
          return `${n} ${label}${n === 1 ? "" : "s"}`;
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
        },
      },
    },
    colors: [
      "var(--primary)",
      "var(--ciencia)",
      "var(--educacion)",
      "var(--salud)",
      "var(--ingenieria)",
      "var(--gestion)",
      "var(--secundary)",
    ],
  }),
  [donutData.labels]
);


  return (
    <div className="ctnInicio">
      <div className="nivel uno">
        {/* TOTAL DE MATERIALES */}
        <div className="item">
          <div className="top">
            <div className="">
              <SVG.Vencimiento />
              <p className="subtitle">Total de Materiales</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {totalMateriales}
              <span>und.</span>
            </p>
            <div className="barra mas">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>

        {/* PRODUCTOS POR ACABARSE */}
        <div className="item">
          <div className="top">
            <div>
              <SVG.Vencimiento />
              <p className="subtitle">Productos por acabarse</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {productosPorAcabarse}
              <span>und.</span>
            </p>
            <div className="barra resta">
              0% <SVG.Resta className="iconoResta" />
            </div>
          </div>
          <div className="bottom" />
        </div>

        {/* PRODUCTOS SIN STOCK */}
        <div className="item">
          <div className="top">
            <div>
              <SVG.Vencimiento />
              <p className="subtitle">Productos sin stock</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              {sinStock.length}
              <span>und.</span>
            </p>
            <div className="barra menos">
              12% <SVG.ArrowDown className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>

        {/* CARD 4 */}
        <div className="item">
          <div className="top">
            <div>
              <SVG.Vencimiento />
              <p className="subtitle">Productos por vencer</p>
            </div>
            <SVG.ArrowRight />
          </div>
          <div className="medium">
            <p className="cantidad">
              5000<span>und.</span>
            </p>
            <div className="barra">
              12% <SVG.ArrowTop className="iconoArriba" />
            </div>
          </div>
          <div className="bottom">
            <p className="disc">
              Mes anterior: <span>4900 und.</span>
            </p>
          </div>
        </div>
      </div>

      <div className="nivel dos">
        {/* MATERIALES POR SEDE */}
        <div className="ctnHistorial">
          <p className="title">Sedes y materiales en total</p>

          <div ref={chartWrapRef} className="chartWrap">
            <Chart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={chartHeight}
            />
          </div>
        </div>

        {/* PRODUCTOS SIN STOCK (detalle) */}
        <div className="vistaRigth">
          <div className="top">
            <p className="title">Productos sin stock</p>

            <div className="input-field">
              <select
                value={selectedSede}
                onChange={(e) => setSelectedSede(e.target.value)}
              >
                <option value="">Todos</option>
                {sedesSinStock.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <label>Sede</label>
            </div>
          </div>

          {/* Donut */}
          <div style={{ width: "100%", height: 280 }}>
            <Chart
              options={donutOptions}
              series={donutData.series}
              type="donut"
              height={280}
            />
          </div>
        </div>
      </div>

      <div className="nivel tres">
        <div>
          <p className="title">
            Mostrar los movimientos de los administradores - SUPER
          </p>
        </div>
        <div>
          <p className="title">
            Mostrar los movimientos de uno mismo - ADMIN
          </p>
        </div>
      </div>
    </div>
  );
}
