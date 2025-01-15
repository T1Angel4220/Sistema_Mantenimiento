import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Grid,
    TextField,
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    Table,
    TableBody,
    TableRow,
    TableCell,
    MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Home, ShoppingCart, Box as Box1, PenTool, FileText, LogOut, Search } from 'lucide-react';

import axios from 'axios';
import DatePicker from 'react-datepicker';


import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function MaintenanceReports() {
    const [reportData, setReportData] = useState({
        equiposConMantenimientos: [],
        actividadesMasHechas: [],
        tiposEquipo: {},
        ubicacionesEquipo: {},
        mantenimientosPorMes: [],
        periodo: { inicio: '', fin: '' },
    });
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [reportType, setReportType] = useState("");
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [barDataMantenimientoPorMes, setBarDataMantenimientoPorMes] = useState({});
    const [dataEstadoMantenimientos, setDataEstadoMantenimientos] = useState(null);
    const [isGenerated, setGenerated] = useState(false);

    const [componentBarData, setComponentBarData] = useState({
        labels: [], // Nombre de los componentes
        datasets: [
            {
                label: 'Total Componentes Usados',
                data: [], // Total de veces que cada componente ha sido usado
                backgroundColor: 'rgba(153, 102, 255, 0.6)',  // Color personalizado para las barras
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1,
            },
        ],
    });
    const [equiposRe, setEquiposRe] = useState(null);
    const [componentesRe, setComponentesRe] = useState(null);
    const [actividadesRe, setActividadesRe] = useState(null);

    const [componentPieData, setComponentPieData] = useState({
        labels: [], // Nombre de los componentes
        datasets: [
            {
                label: 'Cantidad de Componentes',
                data: [], // Total de veces que cada componente ha sido usado
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],  // Colores personalizados
            },
        ],
    });

    const [barData, setBarData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Mantenimientos',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    });
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                min: 0, // El mínimo del eje Y es 0
                ticks: {
                    stepSize: 10, // Escala por decenas
                    beginAtZero: true, // Asegura que el eje Y empiece en 0
                    max: 10 // Mínimo 30, ajusta según el máximo de los datos
                },
            },
        },
    };
    const chartOptionsPie = {
        responsive: true,
        plugins: {
            legend: {
                position: 'right', // Coloca la leyenda al lado derecho del gráfico
                labels: {
                    usePointStyle: true, // Usa puntos en lugar de cuadros en la leyenda
                    boxWidth: 12, // Tamaño de los cuadros en la leyenda
                    generateLabels: function (chart) {
                        // Genera etiquetas personalizadas para la leyenda
                        const data = chart.data;
                        return data.labels.map((label, index) => {
                            // Obtener el valor de cada sección
                            const value = data.datasets[0].data[index];
                            // Retorna el objeto de la leyenda con el valor
                            return {
                                text: `${label}: ${value}`, // Muestra el nombre y el valor en la leyenda
                                fillStyle: data.datasets[0].backgroundColor[index], // Color del cuadro en la leyenda
                                strokeStyle: data.datasets[0].borderColor[index], // Color del borde en la leyenda
                                lineWidth: 1,
                            };
                        });
                    }
                },
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}%`; // Personaliza el tooltip
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 1, // Grosor de los bordes de los segmentos
            },
        },
        cutout: '50%', // Hace que el gráfico sea una dona en lugar de un círculo completo
    };




    const [pieData, setPieData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Cantidad',
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    });



    const fetchData = async () => {
        try {
            // Preparar el payload con la estructura adecuada según el tipo de reporte
            const payload = {
                tipo_reporte: reportType,
                anio: year,
                mes: month,
                fecha_inicio: startDate,
                fecha_fin: endDate,
            };
            console.log(payload)
            // Eliminar las propiedades vacías o innecesarias

            const response = await axios.post('http://localhost:8000/api/reportesPorFecha', payload);
            setReportData(response.data);
            console.log(response.data)
            // Si el reporte es anual, preparar los datos mensuales

            const equipos = response.data.equipos.slice(0, 5); // Obtener solo los 5 primeros equipos
            setEquiposRe(equipos)
            const actividades = response.data.actividades;
            setActividadesRe(actividades)
            const componentes = response.data.componentes;
            const { mantenimientos_iniciados, mantenimientos_terminados, mantenimientos_en_proceso } = response.data;
            setComponentesRe(componentes)
            setBarData({
                labels: equipos.map((equipo) => equipo.nombre),
                datasets: [
                    {
                        label: 'Total Mantenimientos',
                        data: equipos.map((equipo) => equipo.total_mantenimientos),
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });

            // Gráfico de Actividades Más Hechas
            setPieData({
                labels: actividades.map((actividad) => actividad.nombre),
                datasets: [
                    {
                        label: 'Cantidad de Actividades',
                        data: actividades.map((actividad) => actividad.cantidad),  // Utilizamos cantidad
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
                    },
                ],
            });

            setComponentBarData({
                labels: componentes.map((componente) => componente.nombre),
                datasets: [
                    {
                        label: 'Total Componentes Usados',
                        data: componentes.map((componente) => componente.cantidad),
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',  // Color personalizado para las barras
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    },
                ],
            });
            const pieData = {
                labels: ['Iniciados', 'Terminados', 'En Proceso'],
                datasets: [
                    {
                        data: [mantenimientos_iniciados, mantenimientos_terminados, mantenimientos_en_proceso],
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                        borderWidth: 1
                    }
                ]
            };

            setDataEstadoMantenimientos(pieData);
            // Gráfico de Componentes Más Usados (Pastel)
            setComponentPieData({
                labels: componentes.map((componente) => componente.nombre),
                datasets: [
                    {
                        label: 'Cantidad de Componentes',
                        data: componentes.map((componente) => componente.total),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],  // Colores personalizados
                    },
                ],
            });
            const mantenimientosPorMes = response.data.mantenimientos_por_mes;
            if (reportType === "anual") {

                const nombresMeses = [
                    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
                    "Octubre", "Noviembre", "Diciembre"
                ];

                // Procesamos los datos para el gráfico
                const meses = mantenimientosPorMes.map(item => nombresMeses[parseInt(item.mes) - 1]); // Usamos el número de mes para obtener el nombre
                const cantidades = mantenimientosPorMes.map(item => item.cantidad);

                const barData = {
                    labels: meses,
                    datasets: [
                        {
                            label: 'Mantenimientos por Mes',
                            data: cantidades,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                };

                setBarDataMantenimientoPorMes(barData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const nombresMeses = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre",
        "Octubre", "Noviembre", "Diciembre"
    ];


    const generatePDF = async () => {
        setIsGeneratingPDF(true);

        try {
            const element = document.getElementById("report-container");
            const canvas = await html2canvas(element, {
                scale: 2, // Aumenta la resolución del canvas
            });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save("report.pdf");
        } catch (error) {
            console.error("Error generating PDF: ", error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    // Chart options


    const handleGenerate = () => {
        setGenerated(true);
        fetchData();
    };
    const navItems = [
        { icon: Home, label: 'Inicio', route: '/Main' },
        { icon: ShoppingCart, label: 'Proceso de Compra', route: '/ProcesoCompra' },
        { icon: Box1, label: 'Activos', route: '/equipos' },
        { icon: PenTool, label: 'Mantenimientos', route: '/InicioMantenimientos' },
        { icon: FileText, label: 'Reportes', route: '/Reporte' },
    ];
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutModal(false);
    };
    return (

        <div className="flex">
            <Box>
                {/* Sidebar */}
                <aside className="w-64 bg-[#1a374d] text-white flex flex-col h-screen sticky top-0">
                    <div className="p-6 space-y-2">
                        <img
                            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/SK_Telecom_Logo.svg/1200px-SK_Telecom_Logo.svg.png"
                            alt="Logo SK Telecom"
                            className="h-12 w-auto"
                        />
                    </div>
                    <nav className="space-y-1 px-3 flex-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.route}
                                    className="w-full flex items-center px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
                                    onClick={() => navigate(item.route)}
                                >
                                    <Icon className="mr-2 h-5 w-5" />
                                    {item.label}
                                </button>
                            );
                        })}
                    </nav>
                    <div className="p-4 mt-auto">
                        <button
                            className="w-full flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="mr-2 h-5 w-5" />
                            Salir
                        </button>
                    </div>
                </aside>

                {/* Main content area */}
            </Box>
            <Box className="w-full">
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        textAlign: 'center',
                        color: '#ffffff',
                        backgroundColor: '#4caf50',
                        padding: '16px',
                        borderRadius: '8px',
                    }}
                >
                    Reportes de Mantenimiento por Equipos
                </Typography>

                <Box p={4}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Seleccionar Tipo de Reporte</InputLabel>
                        <Select value={reportType} onChange={(e) => setReportType(e.target.value)}>
                            <MenuItem value="anual">Reporte Anual</MenuItem>
                            <MenuItem value="mensual">Reporte Mensual</MenuItem>
                            <MenuItem value="personalizado">Reporte Personalizado</MenuItem>
                        </Select>
                    </FormControl>

                    {reportType === "anual" && (
                        <TextField
                            fullWidth
                            margin="normal"
                            type="number"
                            label="Año"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                        />
                    )}

                    {reportType === "mensual" && (
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    type="number"
                                    label="Año"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth margin="normal">
                                    <Select
                                        label="Mes"
                                        value={month}
                                        onChange={(e) => setMonth(e.target.value)}
                                    >
                                        <MenuItem value={1}>Enero</MenuItem>
                                        <MenuItem value={2}>Febrero</MenuItem>
                                        <MenuItem value={3}>Marzo</MenuItem>
                                        <MenuItem value={4}>Abril</MenuItem>
                                        <MenuItem value={5}>Mayo</MenuItem>
                                        <MenuItem value={6}>Junio</MenuItem>
                                        <MenuItem value={7}>Julio</MenuItem>
                                        <MenuItem value={8}>Agosto</MenuItem>
                                        <MenuItem value={9}>Septiembre</MenuItem>
                                        <MenuItem value={10}>Octubre</MenuItem>
                                        <MenuItem value={11}>Noviembre</MenuItem>
                                        <MenuItem value={12}>Diciembre</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                        </Grid>
                    )}

                    {reportType === "personalizado" && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div className="relative">
                                    <DatePicker
                                        selected={startDate}  // Mantén el valor de inicio de fecha
                                        onChange={(dates) => {
                                            setStartDate(dates[0]);  // Guardar la fecha de inicio
                                            setEndDate(dates[1]);    // Guardar la fecha de fin
                                        }}
                                        startDate={startDate}  // Rango de inicio
                                        endDate={endDate}      // Rango de fin
                                        selectsRange           // Permite seleccionar un rango
                                        placeholderText="Seleccionar rango de fechas"
                                        dateFormat="yyyy-MM-dd"
                                        className="w-[300px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    )}

                    <Button onClick={handleGenerate} fullWidth variant="contained" color="primary" style={{ marginTop: '16px' }}>
                        Generar Reporte
                    </Button>

                </Box>

                {isGenerated && (
                    <>
                        <Box id="report-container">
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    backgroundColor: '#1976d2',
                                    color: '#ffffff',
                                    padding: '16px',
                                    borderRadius: '8px',
                                    marginBottom: '16px',
                                }}
                            >
                                {reportType === "mensual" && (
                                    <Typography variant="h6">
                                        Reporte Mensual - {nombresMeses[month - 1]} {year}
                                    </Typography>
                                )}
                                {reportType === "anual" && (
                                    <Typography variant="h6">
                                        Reporte Anual - {year}
                                    </Typography>
                                )}
                                {reportType === "personalizado" && (
                                    <Typography variant="h6">
                                        Reporte Personalizado - Desde {startDate?.toLocaleDateString()} hasta {endDate?.toLocaleDateString()}
                                    </Typography>
                                )}
                            </Box>

                            <div className="h-8"></div>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '160px', width: '100%' }}>

                                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>
                                    <CardHeader title="Estado de Mantenimientos" />
                                    <CardContent>
                                        {dataEstadoMantenimientos ? (
                                            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', padding: '40px' }}>
                                                <Pie data={dataEstadoMantenimientos} options={chartOptionsPie} />
                                            </Box>
                                        ) : (
                                            <Typography>No hay datos disponibles para mostrar.</Typography>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>
                                    <CardHeader title="Distribución de Actividades" />
                                    <CardContent>
                                        {actividadesRe && actividadesRe.length > 0 ? (
                                            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', padding: '40px' }}>
                                                <Bar data={pieData} options={chartOptions} />
                                            </Box>
                                        ) : (
                                            <Typography>No se registraron actividades para mostrar.</Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '160px', width: '100%', marginTop: '80px' }}>
                                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>
                                    <CardHeader title={reportType === "anual" ? "Componentes Más Usados por Mes" : "Gráfico de Componentes Más Usados"} />
                                    <CardContent>
                                        {componentBarData ? (
                                            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', padding: '40px' }}>
                                                <Bar data={componentBarData} options={chartOptions} />
                                            </Box>
                                        ) : (
                                            <Typography>No hay datos disponibles para mostrar.</Typography>
                                        )}
                                    </CardContent>
                                </Card>

                                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>
                                    <CardHeader title="Distribución Componentes" />
                                    <CardContent>
                                        {componentPieData ? (
                                            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', padding: '40px' }}>
                                                <Pie data={componentPieData} options={chartOptions} />
                                            </Box>
                                        ) : (
                                            <Typography>No hay datos disponibles para mostrar.</Typography>
                                        )}
                                    </CardContent>
                                </Card>
                            </Box>

                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '160px', width: '100%', marginTop: '80px' }}>
                                <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: '100%' }}>
                                    <CardHeader title="Mantenimientos por Mes" />
                                    <CardContent>
                                        {barDataMantenimientoPorMes && barDataMantenimientoPorMes.labels ? (
                                            <Box sx={{ width: '100%', height: '300px', overflow: 'hidden', padding: '40px' }}>
                                                <Bar data={barDataMantenimientoPorMes} options={chartOptions} />
                                            </Box>
                                        ) : (
                                            <Typography>No se registraron mantenimientos por mes para mostrar.</Typography>
                                        )}
                                    </CardContent>
                                </Card>


                            </Box>
                        </Box>
                        <Box mt={4} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={generatePDF}
                                disabled={isGeneratingPDF}
                            >
                                {isGeneratingPDF ? 'Generando PDF...' : 'Generar PDF'}
                            </Button>
                        </Box>
                    </>
                )}
            </Box>
        </div>

    );
}