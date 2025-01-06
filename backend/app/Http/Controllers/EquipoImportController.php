<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use App\Models\Equipo;
use App\Models\ProcesoCompra; // Modelo relacionado con procesos_compra
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class EquipoImportController extends Controller
{
    public function import(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimetypes:text/plain,text/csv,application/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet|max:2048',
        ]);

        try {
            $maxId = Equipo::max('id') ?: 1;
            DB::statement("SELECT setval(pg_get_serial_sequence('equipos', 'id'), $maxId)");

            $file = $request->file('file');
            $extension = $file->getClientOriginalExtension();

            if ($extension === 'csv') {
                $reader = new CsvReader();
                $reader->setDelimiter(';');
                $spreadsheet = $reader->load($file->getRealPath());
            } else {
                $spreadsheet = IOFactory::load($file->getRealPath());
            }

            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            if (empty(array_filter(array_map('array_filter', $data)))) {
                return response()->json(['message' => 'El archivo está vacío.'], 400);
            }

            unset($data[0]); // Remover la cabecera si la hay

            $duplicatedCodes = [];
            $invalidProcesses = [];

            foreach ($data as $row) {
                $row = array_filter($row, function ($value) {
                    return !is_null($value) && $value !== '';
                });

                if (empty($row)) {
                    continue; // Si la fila está completamente vacía, la omite
                }

                $row = array_values($row); // Re-indexar el array después de filtrar

                $codigoBarras = $row[0] ?? null; // Código de barras (columna 1, índice 0)
                if ($codigoBarras && Equipo::where('Codigo_Barras', $codigoBarras)->exists()) {
                    $duplicatedCodes[] = $codigoBarras; // Agregar el código duplicado a la lista
                    continue; // Omitir esta fila
                }

                $fechaAdquisicion = null;
                if (!empty($row[3])) { // Fecha de adquisición (columna 4, índice 3)
                    try {
                        $fechaAdquisicion = Carbon::createFromFormat('d/m/Y', $row[3])->format('Y-m-d');
                    } catch (\Exception $e) {
                        $fechaAdquisicion = null;
                    }
                }

                $procesoCompraId = $row[6] ?? null; // Proceso de compra (columna 7, índice 6)
                if ($procesoCompraId && !ProcesoCompra::where('id', $procesoCompraId)->exists()) {
                    $invalidProcesses[] = $procesoCompraId; // Agregar el proceso de compra inválido
                    continue; // Omitir filas con procesos de compra no válidos
                }

                Equipo::create([
                    'Codigo_Barras' => $codigoBarras,
                    'Nombre_Producto' => $row[1] ?? null, // Nombre del producto (columna 2, índice 1)
                    'Tipo_Equipo' => $row[2] ?? null, // Tipo de equipo (columna 3, índice 2)
                    'Fecha_Adquisicion' => $fechaAdquisicion,
                    'Ubicacion_Equipo' => $row[4] ?? null, // Ubicación (columna 5, índice 4)
                    'Descripcion_Equipo' => $row[5] ?? null, // Descripción (columna 6, índice 5)
                    'proceso_compra_id' => $procesoCompraId,
                ]);
            }

            $message = 'Los datos se insertaron correctamente.';
            $responseType = 'success';

            if (!empty($duplicatedCodes) || !empty($invalidProcesses)) {
                $errorDetails = [];
            
                if (!empty($duplicatedCodes)) {
                    $errorDetails['duplicated_codes'] = $duplicatedCodes;
                }
            
                if (!empty($invalidProcesses)) {
                    $errorDetails['invalid_processes'] = $invalidProcesses;
                }
            
                return response()->json([
                    'message' => 'Advertencia: ',
                    'errors' => $errorDetails,
                ], 422);
            }
            


            return response()->json(['message' => $message], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error: el archivo no cumple con la estructura de la base de datos.'], 500);
        }
    }
}