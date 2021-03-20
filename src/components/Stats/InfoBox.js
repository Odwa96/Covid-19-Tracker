import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";

import "./InfoBox.css";

const InfoBox = ({ title, cases, active, total, ...props }) => {
  return (
    <Card onClick={props.onClick} className={`infoBox ${active && "selected"}`}>
      <CardContent className="center">
        <Typography className="title" color="textSecondary">
          {title}
        </Typography>
        <h2 className="cases">{cases}</h2>
        <Typography className="total" color="textSecondary">
          Total: {total}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
