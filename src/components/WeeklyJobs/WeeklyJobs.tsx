import { FC, useState } from "react";
import { useJobs } from "../../hooks/useJobs/useJobs";
import { CircularProgress, Typography } from "@mui/material";
import { ErrorAlert } from "../ErrorAlert/ErrorAlert";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate } from "react-router-dom";
import isoWeek from "dayjs/plugin/isoWeek";
import {
  Calendar,
  momentLocalizer,
  View,
  Views,
  Event,
  SlotInfo,
} from "react-big-calendar";
import moment from "moment";
import { CalendarWrapper } from "./WeeklyJobs.style";
import "moment/locale/en-gb";
import { CreateJobModal } from "../CreateJobModal/CreateJobModal";
import { JobCalendarColorLegend } from "../JobCalendarColorLegend/JobCalendarColorLegend";

export const WeeklyJobs: FC = () => {
  dayjs.extend(isoWeek);
  const lastMonday = dayjs().isoWeekday(1).format("YYYY-MM-DD");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartTime, setModalStartTime] = useState<Dayjs | null>(null);
  const [modalEndTime, setModalEndTime] = useState<Dayjs | null>(null);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);

  const [startOfWeek, setStartOfWeek] = useState(lastMonday);
  const endOfWeek = dayjs(startOfWeek).add(6, "days").format("YYYY-MM-DD");

  const { jobs, loading, error, reload } = useJobs(
    { from: `${startOfWeek} 00:00`, to: `${endOfWeek} 23:59` },
    "desc",
    false
  );
  const navigate = useNavigate();

  const changeWeekHandler: (
    range: Date[] | { start: Date; end: Date },
    view?: View
  ) => void = (range) => {
    const firstDateofRange = Array.isArray(range) ? range[0] : range.start;
    setStartOfWeek(dayjs(firstDateofRange).format("YYYY-MM-DD"));
  };

  const eventClickHandler = (event: Event) => {
    navigate(`/jobs/${event.resource?.id}`);
  };

  const calendarClickHandler: (slotInfo: SlotInfo) => void = (slotInfo) => {
    setModalStartTime(dayjs(slotInfo.start));
    setModalEndTime(dayjs(slotInfo.end));
    setModalDate(dayjs(slotInfo.start));
    setIsModalOpen(true);
  };

  const closeModalHandler = () => {
    reload();
    setIsModalOpen(false);
    setModalStartTime(null);
    setModalEndTime(null);
    setModalDate(null);
  };

  if (loading) {
    return (
      <>
        <CircularProgress />
      </>
    );
  }

  if (error || !jobs) {
    return (
      <>
        <Typography variant="h4" gutterBottom>
          Jobs
        </Typography>
        <ErrorAlert code={error ?? "INTERNAL_ERROR"} />
      </>
    );
  }

  moment.locale("en-GB");
  const localizer = momentLocalizer(moment);

  const events: Event[] = jobs.map((job) => ({
    resource: { id: job.id, color: job.assignedTo?.color },
    title: job.name,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));

  const eventProps = (event: Event) => {
    if (event.resource?.color) {
      return {
        style: {
          backgroundColor: event.resource.color,
        },
      };
    }
    return {};
  };

  return (
    <>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.WEEK}
          views={[Views.WEEK]}
          onRangeChange={changeWeekHandler}
          dayLayoutAlgorithm="no-overlap"
          step={60}
          timeslots={1}
          min={new Date(`${startOfWeek} 8:00`)}
          max={new Date(`${endOfWeek} 20:00`)}
          onSelectEvent={eventClickHandler}
          onSelectSlot={calendarClickHandler}
          selectable
          eventPropGetter={eventProps}
        />
      </CalendarWrapper>
      <JobCalendarColorLegend jobs={jobs} />
      {isModalOpen && modalDate && modalStartTime && modalEndTime && (
        <CreateJobModal
          onClose={closeModalHandler}
          initialValues={{
            name: "",
            addresses: [],
            date: modalDate,
            startTime: modalStartTime,
            endTime: modalEndTime,
          }}
        />
      )}
    </>
  );
};
