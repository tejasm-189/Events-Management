<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use App\Models\Event;
use App\Notifications\EventReminderNotification;

class SendEventReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-event-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send notifications to all attendees that have event near to start';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $events = Event::with('attendees.user')
            ->whereBetween('start_time', [now(), now()->addDay()])
            ->get();

        $eventCount = $events->count();
        $eventLabel = $eventCount === 1 ? 'event' : 'events';

        $this->info("Found {$eventCount} {$eventLabel} starting in the next 24 hours.");

        foreach ($events as $event) {
            $this->info("Processing event: {$event->name} (ID: {$event->id})");

            foreach ($event->attendees as $attendee) {
                $user = $attendee->user;

                // Assuming User uses Notifiable trait
                $user->notify(
                    new EventReminderNotification($event)
                );

                $this->info("  - Sent reminder to {$user->name} ({$user->email})");
            }
        }

        $this->info('Reminder sending process completed.');
    }
}
