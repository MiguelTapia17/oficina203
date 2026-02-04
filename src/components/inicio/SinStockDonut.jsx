import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";

export default function SinStockDonut({ sinStock = [] }) {
  const [selectedSede, setSelectedSede] = useState(""); // "" = Todas
  const [selectedItem, setSelectedItem] = useState("");
  
  useEffect(() => {
    setSelectedItem("");
  }, [selectedSede]);

  const sedesSinStock = useMemo(() => {
    const set = new Set(sinStock.map((x) => x?.nombre_sede).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [sinStock]);

  const sinStockFiltrado = useMemo(() => {
    if (!selectedSede) return sinStock;
    return sinStock.filter((x) => x?.nombre_sede === selectedSede);
  }, [sinStock, selectedSede]);

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
            const text = selectedSede ? "producto" : "sede";
            return `${n} ${text}${n === 1 ? "" : "s"}`;
          },
        },
      },
      states: {
        active: {
          filter: { type: "none" }, // evita el oscurecido al click
        },
        hover: {
          filter: { type: "none" }, // opcional: evita cambio al hover
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: true, // que se agrande al click
          donut: { size: "68%" },
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
    [donutData.labels, selectedSede]
  );


  return (
    <div className="vistaRigth">
      <div className="top">
        <p className="title">Productos sin stock</p>

        <div className="input-field">
          <select value={selectedSede} onChange={(e) => setSelectedSede(e.target.value)}>
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

      <div style={{ width: "100%", height: 280 }}>
        <Chart options={donutOptions} series={donutData.series} type="donut" height={280} />
      </div>

      
    </div>
  );
}
