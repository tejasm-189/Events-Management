<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Event;
use App\Http\Resources\AttendeeResource;
use App\Models\Attendee;

use App\Http\Traits\CanLoadRelationships;

use Illuminate\Support\Facades\Gate;

class AttendeeController extends Controller
{
    use CanLoadRelationships;

    protected array $relations = ['user', 'event'];

    /**
     * Display a listing of the resource.
     */
    public function index(Event $event)
    {
        $attendees = $this->loadRelationships(
            $event->attendees()->latest()
        );

        return AttendeeResource::collection(
            $attendees->paginate()
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Event $event)
    {
        $attendee = $this->loadRelationships(
            $event->attendees()->create([
                'user_id' => $request->user()->id
            ])
        );

        return new AttendeeResource($attendee);
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event, Attendee $attendee)
    {
        return new AttendeeResource(
            $this->loadRelationships($attendee)
        );
    }


    public function update(Request $request, Event $event, Attendee $attendee)
    {
        Gate::authorize('update', $attendee);

        $attendee->update($request->validate([
            'user_id' => 'sometimes|integer|exists:users,id'
        ]));

        return new AttendeeResource(
            $this->loadRelationships($attendee)
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event, Attendee $attendee)
    {
        Gate::authorize('delete', $attendee);

        $attendee->delete();
        return response(status: 204);
    }
}
