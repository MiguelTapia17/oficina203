import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { useGlobalData } from "../../context/GlobalDataContext";
import { useAuth } from "../../context/AuthContext";

export default function UsuariosPorSedeDonut() {
  const [selectedSede, setSelectedSede] = useState("");

  const { usuarios, sedes, sedesMap, loading } = useGlobalData();
  const { user } = useAuth();

  const role = String(user?.rol ?? "").toLowerCase();
  const currentSedeId = Number(user?.id_sede ?? 0);

  const isSuperAdmin = role === "superadmin";
  const isAdmin = role === "admin";

  const usuariosVisibles = useMemo(() => {
    if (isSuperAdmin) return usuarios || [];
    if (isAdmin) {
      return (usuarios || []).filter(
        (u) => Number(u?.id_sede) === currentSedeId
      );
    }
    return [];
  }, [usuarios, isSuperAdmin, isAdmin, currentSedeId]);

  const sedesDisponibles = useMemo(() => {
    if (isSuperAdmin) {
      return (sedes || [])
        .filter((s) => s?.id_sede && s?.nombre_sede)
        .sort((a, b) => a.nombre_sede.localeCompare(b.nombre_sede));
    }

    if (isAdmin) {
      return (sedes || [])
        .filter((s) => Number(s?.id_sede) === currentSedeId)
        .sort((a, b) => a.nombre_sede.localeCompare(b.nombre_sede));
    }

    return [];
  }, [sedes, isSuperAdmin, isAdmin, currentSedeId]);

  const usuariosAgrupadosPorSede = useMemo(() => {
    const map = new Map();

    for (const user of usuariosVisibles) {
      const idSede = Number(user?.id_sede ?? 0);
      const nombreSede = sedesMap?.[idSede] || "Sin sede";

      if (!map.has(nombreSede)) {
        map.set(nombreSede, 0);
      }

      map.set(nombreSede, map.get(nombreSede) + 1);
    }

    let result = Array.from(map.entries()).map(([nombre_sede, total]) => ({
      nombre_sede,
      total,
    }));

    if (selectedSede) {
      result = result.filter((x) => x.nombre_sede === selectedSede);
    }

    return result.sort((a, b) => b.total - a.total);
  }, [usuariosVisibles, sedesMap, selectedSede]);

  const donutData = useMemo(() => {
    return {
      labels: usuariosAgrupadosPorSede.map((x) => x.nombre_sede),
      series: usuariosAgrupadosPorSede.map((x) => x.total),
    };
  }, [usuariosAgrupadosPorSede]);

  const donutOptions = useMemo(
    () => ({
      chart: {
        type: "donut",
        toolbar: { show: false },
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
            return `${n} usuario${n === 1 ? "" : "s"}`;
          },
        },
      },
      states: {
        active: { filter: { type: "none" } },
        hover: { filter: { type: "none" } },
      },
      plotOptions: {
        pie: {
          expandOnClick: true,
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
      noData: {
        text: "Sin datos",
      },
    }),
    [donutData.labels]
  );

  return (
    <div className="vistaRigth">
      <div className="top">
        <p className="title">Usuarios por sede</p>

        <div className="input-field">
          <select
            value={selectedSede}
            onChange={(e) => setSelectedSede(e.target.value)}
          >
            <option value="">Todos</option>
            {sedesDisponibles.map((s) => (
              <option key={s.id_sede} value={s.nombre_sede}>
                {s.nombre_sede}
              </option>
            ))}
          </select>
          <label>Sede</label>
        </div>
      </div>

      <div style={{ width: "100%", height: 280 }}>
        {loading ? (
          <p style={{ opacity: 0.7 }}>Cargando...</p>
        ) : (
          <Chart
            options={donutOptions}
            series={donutData.series}
            type="donut"
            height={280}
          />
        )}
      </div>
    </div>
  );
}