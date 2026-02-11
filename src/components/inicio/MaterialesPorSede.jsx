import { useEffect, useMemo, useRef, useState } from "react";
import Chart from "react-apexcharts";

export default function MaterialesPorSede({ sedes = [] }) {
  const chartWrapRef = useRef(null);
  const [chartHeight, setChartHeight] = useState(300);

  useEffect(() => {
    if (!chartWrapRef.current) return;

    let frame;

    const ro = new ResizeObserver((entries) => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const containerHeight = entries[0]?.contentRect?.height || 300;

        // altura deseada
        const nextHeight = Math.min(containerHeight, 420); // 👈 MAX REAL

        setChartHeight((prev) => (prev !== nextHeight ? nextHeight : prev));
      });
    });

    ro.observe(chartWrapRef.current);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
    };
  }, []);


  const chartCategorias = useMemo(() => sedes.map((s) => s.nombre_sede), [sedes]);

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
      colors: ["#FF0C29"],
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

  return (
    <div className="ctnHistorial">
      <p className="title">Sedes y materiales en total</p>

      <div ref={chartWrapRef} className="chartWrap">
        <Chart options={chartOptions} series={chartSeries} type="bar" height={chartHeight} />
      </div>
    </div>
  );
}
