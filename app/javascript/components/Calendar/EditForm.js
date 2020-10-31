import React, { useState, useEffect } from 'react';
import axios from "axios";
import {
  makeStyles,
  Button,
  Select,
  FormControl,
  FormHelperText,
  TextField,
  MenuItem,
  InputLabel,
  DialogTitle, DialogContent, DialogActions
} from "@material-ui/core";
import { DateTimePicker } from "@material-ui/pickers";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { EditAttributes } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  form: {
    // position: "absolute",
    // width: 600,
    // backgroundColor: "white",
    border: "2px solid #000",
    boxShadow: "10px 5px 5px black",
    // padding: "16px 32px 24px",
    // top: "50%",
    // left: "50%",
    // transform: "translate(-50%, -50%)",
    color: theme.palette.primary.main,
  },
  textfield: {
    width: "100%",
    margin: "auto",
  },
  button: {
    textAlign: "right",
    justifyItems: "space-between",
    alignSelf: "right",
  },
  title: {
    textAlign: "center",
    width: "100%",
    fontSize: theme.typography.h4.fontSize,
  },
  formControl: {
    width: "100%",
    margin: theme.spacing(1, 0, 2),
  },
  dateTimePickerContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  dateTimePicker: {
    margin: theme.spacing(2, 1, 2),
  },
}));

const EditForm = (props) => {
  const styles = useStyles();
  const { currentUser, setCurrentUser, errors } = props;
  const { slotInfo, setSlotInfo } = props;
  const { events, setEvents } = props;


  const [ user, setUser ] = useState({
    first_name: " ",
    last_name: "",
    id: "0"
  });

  const [users, setUsers] = useState([]);
  useEffect(() => {
    axios.get("/api/v1/users")
      .then(response => {
        console.log(response);
        setUsers(response.data.data);
      });
  }, []);

  const [ horse, setHorse ] = useState({
    name: "",
    id: 0
  });
  
  useEffect(() => {
    axios.get("/api/v1/rides")
      .then(response => {
        const listOfRides = response.data.data;
        const userDataRidesTable = listOfRides.find(i => i.attributes.booking_id == slotInfo.id);
        console.log(userDataRidesTable);
        console.log(typeof userDataRidesTable.attributes.horse);
        setHorse(userDataRidesTable.attributes.horse);
        setUser(userDataRidesTable.attributes.user);
        console.log(userDataRidesTable.attributes.horse);
        // setUser(userDataRidesTable.attributes.user_id);
      });
  }, []);

  const [horses, setHorses] = useState([]);
  const loadHorses = () => {
    axios.get("/api/v1/horses")
      .then(response => {
        const listOfHorses = response.data.data;
        setHorses(listOfHorses);
      });
  };
  useEffect(loadHorses, []);

  const [bookings, setBookings] = useState([]);
  const loadBookings = () => {
    axios.get("/api/v1/bookings")
      .then(response => {
        setBookings(response.data.data);
      });
  };
  useEffect(loadBookings, []);
  
  console.log(slotInfo, "<<< slot info");
  
  const handleDelete = () => {
    event.preventDefault();

    console.log("delete", "slot=", slotInfo, "user=", user, "horse=",horse);
  };

  const handleEdit = (e) => {
    props.onSubmit({slotInfo, horse, user });
  };

  // selecting the event type
  const handleBookingChange = (e) => {
    console.log("changeeee event:,", e.target.name);
    console.log("changeeee event:,", e.target.value);
    console.log("changeeee event:,", slotInfo);
    props.onChange(e);
  };


  return (
 
    <div className={styles.form}>
      <DialogTitle
        id="form-dialog-title"
        className={styles.title}
        disableTypography
      >
        Booking
      </DialogTitle>
      <DialogContent>
        <MuiPickersUtilsProvider utils={MomentUtils}>
          <FormControl className={styles.formControl}>
            <InputLabel id="booking-type-label">Booking Type</InputLabel>
            <Select
              labelId="booking-type-label"
              name="event_type"
              value={slotInfo.event_type}
              onChange={handleBookingChange}
            >
              <MenuItem value={"lesson"}>Lesson</MenuItem>
              <MenuItem value={"ride"}>Ride</MenuItem>
              <MenuItem value={"other_arena"}>Other Arena Booking</MenuItem>
            </Select>
          </FormControl>
          <div className={styles.dateTimePickerContainer}>
            <DateTimePicker
              label="Start Time"
              name="start_time"
              inputVariant="outlined"
              className={styles.dateTimePicker}
              autoOk
              openTo="hours"
              value={slotInfo.start_time}
              onChange={(start_time) => setSlotInfo({...slotInfo, start_time: e.target.value})}
            />
            <DateTimePicker
              label="End Time"
              name="end_time"
              inputVariant="outlined"
              className={styles.dateTimePicker}
              autoOk
              openTo="hours"
              value={slotInfo.end_time}
              onChange={(end_time) => setSlotInfo({...slotInfo, end_time: e.target.value})}
            />
          </div>
          {slotInfo.event_type === "ride" && (


            <>
              <FormControl className={styles.formControl}>
                <InputLabel id="rider-select-label">Rider</InputLabel>
                <Select
                  labelId="rider-select-label"
                  id="rider-select"
                  value={user.id}
                  onChange={(e) => setUser({...user, id: e.target.value })}
                >
                  {users.map((user) => {
                    return (
                      <MenuItem value={user.id} key={user.id}>
                        {user.attributes.first_name} {user.attributes.value}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
              <FormControl
                className={styles.formControl}
                error={errors && errors.horse ? true : false}
              >
                <InputLabel id="horse-select-label">Horse</InputLabel>
                <Select
                  labelId="horse-select-label"
                  id="horse-select"
                  value={horse.id}
                  onChange={(e) => setHorse({...horse, name: e.target.value })}
                >
                  {horses.map((horse) => {
                    return (
                      <MenuItem value={horse.id} key={horse.id}>
                        {horse.attributes.name}
                      </MenuItem>
                    );
                  })}
                </Select>
                <FormHelperText>{errors && errors.horse}</FormHelperText>
              </FormControl>
            </>
          )}
        </MuiPickersUtilsProvider>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleEdit} color="primary">
Edit
        </Button>
        <Button onClick={handleDelete} color="primary">
Delete
        </Button>
      </DialogActions>
    </div>
  );
};

export default EditForm;