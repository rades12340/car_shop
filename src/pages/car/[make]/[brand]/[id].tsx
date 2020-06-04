import { GetServerSideProps } from "next";
import { openDB } from "../../../../openDB";
import { CarModel } from "../../../../../api/Car";
import { Paper, Grid, Typography, makeStyles } from "@material-ui/core";
import Head from "next/head";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: "auto",
  },

  img: {
    width: "100%",
  },
}));

interface CarDetailsProps {
  car: CarModel | null | undefined;
}

export default function CarDetails({ car }: CarDetailsProps) {
  const classes = useStyles();

  if (!car) {
    return <h1>Sorry, car not found!</h1>;
  }

  return (
    <div>
      <Head>
        <title>{car.make + " " + car.model}</title>
      </Head>
      <Paper>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={5}>
            <img alt="complex" src={car.photoUrl} className={classes.img} />
          </Grid>
          <Grid item xs={12} sm={6} md={7} container spacing={3}>
            <Grid item xs container direction="column" spacing={4}>
              <Grid item xs>
                <Typography gutterBottom variant="h5">
                  {car.make + car.model}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  ${car.price}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  <span style={{ color: "black" }}>Year</span>: {car.year}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  <span style={{ color: "black" }}>Kilometers</span>:{" "}
                  {car.kilometers}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  <span style={{ color: "black" }}>Fuel</span>: {car.fuelType}
                </Typography>
                <Typography gutterBottom variant="body2" color="textSecondary">
                  <span style={{ color: "black" }}>Details</span>: {car.details}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">$19.00</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params.id;
  const db = await openDB();
  const car = await db.get<CarModel | undefined>(
    "SELECT * FROM Car where id = ?",
    id
  );
  return { props: { car: car || null } };
};
