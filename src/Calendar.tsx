import { useRef, useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import multiMonthPlugin from "@fullcalendar/multimonth";
import interactionPlugin from "@fullcalendar/interaction";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockFetchEvents = async () => {
  return [
    {
      id: "1",
      title: "Meeting Scheduled",
      start: "2024-05-01T10:00:00",
      end: "2024-05-01T11:00:00",
    },
    {
      id: "2",
      title: "Someone's Birthday Event",
      start: "2024-05-06T00:00:00",
      end: "2024-05-06T13:59:59",
    },
    {
      id: "3",
      title: "Meeting Scheduled",
      start: "2024-05-12T16:00:00",
      end: "2024-05-12T18:00:00",
    },
    {
      id: "4",
      title: "Someone's Birthday Event",
      start: "2024-05-14T11:00:00",
      end: "2024-05-15T13:59:59",
    },
    {
      id: "5",
      title: "Google Meet",
      start: "2024-05-14T14:00:00",
      end: "2024-05-14T16:59:59",
    },
    {
      id: "6",
      title: "Teams Meeting",
      start: "2024-05-12T17:00:00",
      end: "2024-05-13T19:59:59",
    },

    {
      id: "7",
      title: "Meeting Scheduled",
      start: "2024-05-10T16:00:00",
      end: "2024-05-11T11:00:00",
    },
  ];
};

const mockCreateEvent = async (event: any) => {
  return { id: String(Date.now()), ...event };
};

const mockDeleteEvent = async (eventId: any) => {
  console.log(eventId);
  return true;
};

const Calendar = () => {
  const calendarRef = useRef(null);
  const [events, setEvents] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const events = await mockFetchEvents();
    setEvents(events);
  };

  const handleSelect = async (info: any) => {
    setNewEvent({
      ...newEvent,
      start: info.startStr,
      end: info.endStr || info.startStr,
    });
    setIsDialogOpen(true);
  };

  const handleEventClick = async (info: any) => {
    if (
      window.confirm(`Do you want to delete the event '${info.event.title}'?`)
    ) {
      await mockDeleteEvent(info.event.id);
      setEvents(events.filter((event: any) => event.id !== info.event.id));
    }
  };

  const handleEventDrop = async (info: any) => {
    const updatedEvent = {
      ...info.event.extendedProps,
      title: info.event.title,
      start: info.event.startStr,
      end: info.event.endStr || info.event.startStr,
    };
    setEvents(
      events.map((event: any) =>
        event.id === info.event.id ? updatedEvent : event
      )
    );
  };

  const handleDialogSubmit = async () => {
    const createdEvent = await mockCreateEvent(newEvent);
    setEvents([...events, createdEvent]);
    setIsDialogOpen(false);
    setNewEvent({ title: "", start: "", end: "" });
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({ ...prevEvent, [name]: value }));
  };

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Enter the details for the new event.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={newEvent.title}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start" className="text-right">
                Start Date & Time
              </Label>
              <Input
                id="start"
                name="start"
                type="datetime-local"
                value={newEvent.start}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end" className="text-right">
                End Date & Time
              </Label>
              <Input
                id="end"
                name="end"
                type="datetime-local"
                value={newEvent.end}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleDialogSubmit}>
              Save Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          multiMonthPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right:
            "multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={events}
        editable={true}
        droppable={true}
        selectable={true}
        select={handleSelect}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
        eventContent={renderEventContent}
        dayMaxEventRows={2}
        moreLinkClick="popover"
        moreLinkContent={({ num }) => `+${num} more`}
      />
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  return (
    <div className="flex items-center overflow-clip hover:overflow-visible">
      {eventInfo.timeText && (
        <span className="font-bold mr-1 text-lime-600 text-2xl ">•</span>
      )}
      <div>
        <b>{eventInfo.timeText}</b>
        <i className="px-2 py-1 hover:overflow-visible">
          {eventInfo.event.title}
        </i>
      </div>
    </div>
  );
};

export default Calendar;
