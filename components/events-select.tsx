'use client'

import { useState } from "react"
import { EVENTS, Events } from "@/types/events"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { capitalize } from "@/lib/utils"

type EventsSelectProps = {
  events: Events[]
  onEventsChange: (value: Events[]) => void
  otherEvents: string[]
  onOtherEventsChange: (value: string[]) => void
}

export default function EventsSelect({ events, otherEvents, onEventsChange, onOtherEventsChange }: EventsSelectProps) {

  const [otherEvent, setOtherEvent] = useState("");

  function toggle(event: Events) {
    onEventsChange(
      events.includes(event)
        ? events.filter((e) => e !== event)
        : [...events, event]
    )
  }

  function handleAddOtherEvent() {
    onOtherEventsChange(
      [...otherEvents, otherEvent.trim()]
    )

    setOtherEvent("");
  }

  function handleRemoveOtherEvent(event: string) {
    onOtherEventsChange(otherEvents.filter((e) => e !== event))    
  }
  
  return (

    <div className="flex flex-wrap gap-2 my-5">
      {EVENTS.map((event) => {
        const selected = events.includes(event)

        return (
          <Button 
            key={event}
            variant={selected ? 'default' : 'outline'}
            size={'lg'}
            onClick={() => toggle(event)}
          >
            {capitalize(event)}
          </Button>
        )
      })}

      {(events.includes("OTHER") && otherEvents.length > 0) && (
        otherEvents.map((item) => (
          <div
            key={item}
            className="flex items-center gap-1 rounded-full border bg-secondary py-1 pl-3 pr-1 text-sm"
          >
            <span>{item}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full"
              aria-label={`Remove ${item}`}
              onClick={() => handleRemoveOtherEvent(item)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))
      )}

      { events.includes(("OTHER")) &&
        <div className="flex items-center gap-2">
          <Input 
            value={otherEvent}
            onChange={(e) => setOtherEvent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddOtherEvent()
              }
            }}
            placeholder="Add an event, e.g. 600m hurdles" 
          />
          <Button 
            variant={'outline'}
            onClick={handleAddOtherEvent}
          >
            Add
          </Button>
        </div>
      }
    </div>

  )

}