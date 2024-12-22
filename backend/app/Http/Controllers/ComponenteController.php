<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Componente;

class ComponenteController extends Controller
{
    public function index()
    {
        $componentes = Componente::all(); // Retrieve all records from the componentes table
        return $componentes; // Return the data as JSON
    }

    // Show the form for creating a new resource
    public function create()
    {
        // Typically, you would return a view to show a form, but for now, we don't need it in the API context
    }

    // Store a newly created resource in storage
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:componentes',
            'descripcion' => 'nullable|string',
        ]);

        $componente = Componente::create($validated); // Create and save the new component
        return response()->json($componente, 201); // Return the created resource
    }

    // Display the specified resource
    public function show($id)
    {
        $componente = Componente::findOrFail($id); // Retrieve a single record by its ID
        return response()->json($componente);
    }

    // Show the form for editing the specified resource
    public function edit($id)
    {
        // Typically, you'd return a view with the current data to edit, but this is an API controller
    }

    // Update the specified resource in storage
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100|unique:componentes,nombre,' . $id,
            'descripcion' => 'nullable|string',
        ]);

        $componente = Componente::findOrFail($id); // Find the record by ID
        $componente->update($validated); // Update the component
        return response()->json($componente);
    }

    // Remove the specified resource from storage
    public function destroy($id)
    {
        $componente = Componente::findOrFail($id); // Find the record by ID
        $componente->delete(); // Delete the component
        return response()->json(null, 204); // Return a successful response with no content
    }
}
