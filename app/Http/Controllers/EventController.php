<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Http\Resources\EventResource;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $relations = [];

        if ($this->shouldIncludeRelation('user')) {
            $relations[] = 'user';
        }

        if ($this->shouldIncludeRelation('attendees')) {
            $relations[] = 'attendees.user';
        }

        return EventResource::collection(
            Event::with($relations)->paginate()
        );
    }

    protected function shouldIncludeRelation(string $relation): bool
    {
        $include = request()->query('include');

        if (!$include) {
            return false;
        }

        $relations = explode(',', $include);

        return in_array($relation, $relations);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
        ]);

        $event = Event::create(array_merge(
            $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
            ]),
            ['user_id' => 1]
        ));

        $event->load('user', 'attendees.user');

        return new EventResource($event);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        if ($this->shouldIncludeRelation('user')) {
            $event->load('user');
        }

        if ($this->shouldIncludeRelation('attendees')) {
            $event->load('attendees.user');
        }

        return new EventResource($event);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'sometimes|date',
            'end_time' => 'sometimes|date|after:start_time',
        ]);

        $event->update($validated);

        $event->load('user', 'attendees.user');

        return new EventResource($event);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        //
        $event->delete();
        return response(status: 204);
    }
}
