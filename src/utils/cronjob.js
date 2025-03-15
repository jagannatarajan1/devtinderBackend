const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("../utils/mail");
// const ConnectionRequestModel = require("../models/connectionRequest");
const ConnectionRequestModel = require("../models/connectionRequest");

// This job will run at 8 AM in the morning everyday
cron.schedule("18 18 * * *", async () => {
  // Send emails to all people who got requests the previous day
  try {
    const yesterday = subDays(new Date(), 0);

    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: yesterdayStart,
        $lt: yesterdayEnd,
      },
    }).populate("fromUserId toUserId");

    const listOfEmails = [
      ...new Set(pendingRequests.map((req) => req.toUserId.emailId)),
    ];

    console.log(listOfEmails);

    for (const email of listOfEmails) {
      // Send Emails
      try {
        const res = await sendEmail(
          "New Friend Requests pending for " + email,
          "Ther eare so many frined reuests pending, please login to DevTinder.in and accept or reject the reqyests."
        );
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.error(err);
  }
});
