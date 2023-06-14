import React, { useState } from "react";
import { Paper, Typography } from "@mui/material";
import "./App.css";

// export default function FeedbackBox(timeStamp, feedBack) {
export default function FeedbackBox({date, feedback}) {
  return(    
    <Paper className="feedback-box" elevation={4}>
        <Typography align="left">
          <div className="content feedback-box">
          <p> {date} </p>
          <p> {feedback} </p>
          </div>
        </Typography>
    </Paper>
  );
}