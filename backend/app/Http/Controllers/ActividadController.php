<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Actividad;

class ActividadController extends Controller
{
    public function index()
    {
        $actividades = Actividad::all(); // Retrieve all records from the actividades table
        return $actividades; // Return the data as JSON
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:actividades',
        ]);

        $actividad = Actividad::create($validated); // Create and save the new activity
        return response()->json($actividad, 201); // Return the created resource
    }

    // Display the specified resource
    public function show($id)
    {
        $actividad = Actividad::findOrFail($id); // Retrieve a single record by its ID
        return response()->json($actividad);
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:actividades,nombre,' . $id,
        ]);

        $actividad = Actividad::findOrFail($id); // Find the record by ID
        $actividad->update($validated); // Update the activity
        return response()->json($actividad);
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        $actividad = Actividad::findOrFail($id); // Find the record by ID
        $actividad->delete(); // Delete the activity
        return response()->json(null, 204); // Return a successful response with no content
    }
}
