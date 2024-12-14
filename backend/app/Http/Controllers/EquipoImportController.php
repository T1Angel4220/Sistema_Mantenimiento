<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Csv as CsvReader;
use App\Models\Equipo;
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

            foreach ($data as $row) {
                $row = array_filter($row, function($value) {
                    return !is_null($value) && $value !== '';
                });

                if (empty($row)) {
                    continue; // Si la fila está completamente vacía, la omite
                }

                $row = array_values($row); // Re-indexar el array después de filtrar

                $fechaAdquisicion = null;
                if (!empty($row[2])) {
                    try {
                        $fechaAdquisicion = Carbon::createFromFormat('d/m/Y', $row[2])->format('Y-m-d');
                    } catch (\Exception $e) {
                        $fechaAdquisicion = null;
                    }
                }

                Equipo::create([
                    'Nombre_Producto' => $row[0] ?? null,
                    'Tipo_Equipo' => $row[1] ?? null,
                    'Fecha_Adquisicion' => $fechaAdquisicion,
                    'Ubicacion_Equipo' => $row[3] ?? null,
                    'Descripcion_Equipo' => $row[4] ?? null,
                ]);
            }

            return response()->json(['message' => 'Los datos se insertaron correctamente.'], 200);
        } catch (\Exception $e) {
            // Cambiar el mensaje de error a uno genérico
            return response()->json(['message' => 'Error: el archivo no cumple con la estructura de la base de datos.'], 500);
        }
    }
}
