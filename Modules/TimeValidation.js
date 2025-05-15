export function validateReserveTime() {
  var currentDate = new Date();
  var currentHour = currentDate.getHours();
  var currentMinute = currentDate.getMinutes();

  // Define the time ranges
  var timeRanges = [
    {
      start: { hour: 8, minute: 10 },
      end: { hour: 8, minute: 40 },
    },
    {
      start: { hour: 9, minute: 5 },
      end: { hour: 18, minute: 59 },
    },
  ];

  // Convert current time to minutes for easier comparison
  var currentTotalMinutes = currentHour * 60 + currentMinute;

  let BreakStartTotalMinutes =
    timeRanges[0].start.hour * 60 + timeRanges[0].start.minute;
  let BreakEndTotalMinutes =
    timeRanges[0].end.hour * 60 + timeRanges[0].end.minute;
  let LunchStartTotalMinutes =
    timeRanges[1].start.hour * 60 + timeRanges[1].start.minute;
  let LunchEndTotalMinutes =
    timeRanges[1].end.hour * 60 + timeRanges[1].end.minute;

  // Check if the current time falls within any of the specified ranges
  if (
    currentTotalMinutes >= BreakStartTotalMinutes &&
    currentTotalMinutes <= BreakEndTotalMinutes
  ) {
    return "Break";
  } else if (
    currentTotalMinutes >= LunchStartTotalMinutes &&
    currentTotalMinutes <= LunchEndTotalMinutes
  ) {
    return "Lunch";
  } else {
    return false;
  }
  // for (var i = 0; i < timeRanges.length; i++) {
  //   var startTotalMinutes =
  //     timeRanges[i].start.hour * 60 + timeRanges[i].start.minute;
  //   var endTotalMinutes =
  //     timeRanges[i].end.hour * 60 + timeRanges[i].end.minute;

  //   if (
  //     currentTotalMinutes >= startTotalMinutes &&
  //     currentTotalMinutes <= endTotalMinutes
  //   ) {
  //     return true;
  //   }
  // }
  return false;
}
