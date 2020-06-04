import React, { useState } from "react";
import { Grid, Link } from "@material-ui/core";
import Search from ".";
import { GetServerSideProps } from "next";
import { getAsString } from "../getAsString";
import { getMakes, Make } from "../database/getMakes";
import { getModels, CarModel } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import { useRouter } from "next/router";
import { stringify } from "querystring";
import useSWR from "swr";
import deepEqual from "fast-deep-equal";
import { CarCard } from "../components/CarCard";
import { CarPagination } from "../components/CarPagination";

export interface CarsListProps {
  makes: Make[];
  models: CarModel[];
  cars: CarModel[];
  totalPages: number;
}

const Cars = ({ makes, models, cars, totalPages }: CarsListProps) => {
  const { query } = useRouter();
  const [serverQuery] = useState(query);
  const { data } = useSWR("/api/cars?" + stringify(query), {
    dedupingInterval: 15000,
    initialData: deepEqual(query, serverQuery)
      ? { cars, totalPages }
      : undefined,
  });

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={5} md={3} lg={2}>
        <Search singleColumn makes={makes} models={models} />
      </Grid>
      <Grid container item xs={12} sm={7} md={9} lg={10} spacing={3}>
        <Grid item xs={12}>
          <CarPagination query={query} totalPages={data?.totalPages} />
        </Grid>
        {((data && data!.cars) || []).map((car) => (
          <Grid item key={car.id} xs={12} sm={6}>
            <CarCard car={car} key={car.id} />
          </Grid>
        ))}
        <Grid item xs={12}>
          <CarPagination query={query} totalPages={data?.totalPages} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsString(ctx.query.make);
  const [makes, models, pagination] = await Promise.all([
    getMakes(),
    getModels(make),
    getPaginatedCars(ctx.query),
  ]);
  return {
    props: {
      makes,
      models,
      cars: pagination.cars,
      totalPages: pagination.totalPages,
    },
  };
};

export default Cars;
